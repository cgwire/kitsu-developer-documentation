# S3 Storage

If your environment variables file (/etc/zou/zou.env) uses a S3 backend:

* `FS_BACKEND`: Set this variable with "s3"
* `FS_BUCKET_PREFIX`: A prefix for your bucket names, it's mandatory to 
   set it to properly use S3.
* `FS_S3_REGION`: Example: *eu-west-3*
* `FS_S3_ENDPOINT`: The url of your region. 
   Example: *https://s3.eu-west-3.amazonaws.com*
* `FS_S3_ACCESS_KEY`: Your user access key.
* `FS_S3_SECRET_KEY`: Your user secret key.

If you haven't done yet, install the following package in your virtual environment:

```
sudo /opt/zou/zouenv/bin/python -m pip install boto3
```
