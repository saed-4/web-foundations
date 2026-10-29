# SnapShare Photo App Scaling Plan

## 1. Assumptions and Traffic Estimates

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

### Assumptions

- Registered users: 10 million.
- 10% of registered users are active daily.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each photo also has a 50 KB thumbnail.
- One day has 86,400 seconds, and one year has 365 days.
- Average traffic is spread evenly across the day.
- Peak feed traffic is five times the average.
- All photos and thumbnails are retained for one year, without deletions or compression savings.
- Storage calculations use decimal units: 1 TB = 1,000 GB.

### Daily Active Users

Daily active users (DAU) are the users who use the application on a particular day.

DAU = Registered users × Daily activity percentage

DAU = 10,000,000 × 10%

**Daily active users = 1,000,000**

### Uploads Per Second

Each daily active user uploads one photo per day.

Daily uploads = 1,000,000 × 1 = 1,000,000 photos

Average uploads per second = 1,000,000 ÷ 86,400

**Average upload rate ≈ 11.6 photos per second.**

### Feed Views Per Second

Each daily active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50

Daily feed views = 50,000,000

Average feed views per second = 50,000,000 ÷ 86,400

**Average feed views ≈ 579 per second.**

Peak feed views per second = 579 × 5

**Peak feed views ≈ 2,894 per second.**

These are estimated feed page requests, not individual photo requests. Loading a feed may generate additional requests for photos and thumbnails.

### Photo Storage Per Year

Each day, users upload 1,000,000 original photos.

Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2 TB

Thumbnail storage per day:

1,000,000 × 50 KB = 50 GB

Original photo storage per year:

2 TB × 365 = 730 TB

Thumbnail storage per year:

50 GB × 365 = 18.25 TB

Total photo storage per year:

730 TB + 18.25 TB = 748.25 TB

**Estimated total storage growth = 748.25 TB per year.**

This estimate excludes database records, backups, replicas, and other operational overhead.

## 2. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only one photo per day.

The system handles approximately 50 million feed views and 1 million uploads daily, a ratio of 50 feed views for every upload.

The architecture should therefore prioritize fast feed loading and efficient delivery of photos. A CDN and cache can serve frequently requested content without repeatedly contacting the application servers or database. Database read replicas can handle read queries, while application servers and the database continue processing uploads and other writes.

## 3. Why Photos Should Not Be Stored Inside the Database

Photos should not be stored directly inside database tables because large binary files consume database storage, increase backup sizes, and can make database operations and recovery more expensive.

Instead, original photos and thumbnails should be stored in **object storage**. The database should store photo metadata, such as the photo ID, owner ID, caption, upload time, and object storage key.

The CDN can then deliver the photo files efficiently to users without sending every image request through the application servers.

## 4. Architecture Diagram


                     USERS
                       |
                       v
                +-------------+
                |     CDN     |
                +-------------+
                  |         |
       Cached photos       Feed/API requests
                  |         |
                  |         v
                  |   +-----------------+
                  |   | Load Balancer   |
                  |   +-----------------+
                  |         |
                  |         v
                  |   +-----------------+
                  |   |  App Servers    |
                  |   +-----------------+
                  |      |    |     |
                  |      |    |     +------------------+
                  |      |    |                        |
                  |      v    v                        v
                  |  +-------+  +----------------+  +----------------+
                  |  | Cache |  | Primary        |  | Upload Queue   |
                  |  +-------+  | Database       |  +----------------+
                  |      |      +----------------+          |
                  |      |              |                    v
                  |      |              v             +----------------+
                  |      |      +----------------+    | Thumbnail     |
                  |      |      | Read Replica   |    | Worker        |
                  |      |      +----------------+    +----------------+
                  |      |                                  |
                  |      |                                  v
                  |      |                           +----------------+
                  +------+-------------------------->| Object Storage |
                                                     | Originals and  |
                                                     | Thumbnails     |
                                                     +----------------+

## 5. What Each Component Does

- **CDN:** Caches and delivers photos and thumbnails from locations closer to users, reducing latency and application server load.
- **Load balancer:** Distributes incoming application requests across multiple app servers so that one server does not become a bottleneck.
- **App servers:** Handle application logic, authentication, upload coordination, feed generation, and requests from users.
- **Cache:** Stores frequently accessed feed data and metadata to reduce repeated database queries and speed up feed loading.
- **Primary database:** Stores authoritative application data and processes writes, including photo metadata, user relationships, and upload records.
- **Read replica:** Copies database changes from the primary database and handles suitable read queries to reduce pressure on the primary.
- **Object storage:** Stores original photos and thumbnails as files independently of the database, providing scalable and durable storage.
- **Upload queue:** Holds thumbnail-generation jobs so that image processing can happen asynchronously instead of delaying the upload response.
- **Thumbnail worker:** Takes jobs from the queue, creates smaller versions of uploaded photos, stores the thumbnails in object storage, and updates their processing status in the database.

## 6. Photo Upload Flow

1. A user selects a photo and submits it through the SnapShare application.
2. The app server authenticates the user and validates the upload request, including file type and size.
3. The server creates a photo record in the primary database with a status such as `PROCESSING`.
4. The application provides a secure, short-lived upload URL so the client can upload the original photo directly to object storage.
5. The client uploads the photo to object storage using that URL.
6. After the upload succeeds, the application verifies the upload and places a thumbnail-generation job on the queue.
7. The thumbnail worker retrieves the job and downloads or reads the original photo from object storage.
8. The worker generates a 50 KB thumbnail, where achievable, and saves it in object storage.
9. The worker updates the photo record to indicate that thumbnail processing is complete and the photo is ready to display.
10. The photo becomes available in the user's feed, and the CDN can cache and deliver the original photo or thumbnail when requested.

The queue allows uploads to complete without making users wait for thumbnail generation. Failed jobs can be retried, and the worker should avoid creating duplicate results when processing the same job more than once.

## 7. Trade-Offs

### Trade-Off 1: Cache Speed vs. Data Freshness

Caching feed data improves performance and reduces database load. However, cached data may become outdated when users upload new photos or change who they follow. Cache expiration and invalidation help balance speed with freshness.

### Trade-Off 2: Read Replicas vs. Immediate Consistency

Read replicas distribute read traffic and reduce load on the primary database. However, replication can lag, meaning a newly uploaded photo may not appear immediately in a feed served by a replica. The application can temporarily read recent changes from the primary when necessary.

### Trade-Off 3: Asynchronous Processing vs. Immediate Availability

Using a queue and thumbnail worker keeps uploads responsive and allows image processing to scale independently. However, thumbnail creation may be delayed when the queue is busy or a worker fails. The application should show a processing state and retry failed jobs.

### Trade-Off 4: Object Storage and CDN vs. Cost and Complexity

Object storage and a CDN scale well for large numbers of photos and reduce application server traffic. However, they introduce storage, bandwidth, caching, and access-control costs. SnapShare should use appropriate caching policies, secure access, and lifecycle rules to manage expenses.

## 8. Conclusion

SnapShare has 1 million daily active users, approximately 11.6 photo uploads per second, 579 average feed views per second, and 2,894 peak feed views per second.

Its estimated photo storage growth is 748.25 TB per year, including original photos and thumbnails.

Because SnapShare is read-heavy, its architecture prioritizes fast feed delivery using a CDN, cache, load balancer, and database read replica. Object storage handles photo files, while a queue and thumbnail worker process images asynchronously. These components allow the system to scale as user activity and stored photos increase.