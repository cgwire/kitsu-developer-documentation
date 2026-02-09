# Hardware Requirements

| Users    | Cores | RAM |
| -------- | ----- | --- |
| 1-10     | 2     | 4   |
| 11 - 30  | 2     | 8   |
| 31 - 80  | 4     | 15  |
| 81 - 200 | 8     | 30  |

That's the recommended minimum. But it depends on the activity of the production/studio.

* The size of the files/videos sent
* The frequency with which files/videos are sent
* The network speed available between the workstations and the instance.

Regarding disk space, you need to allow for a factor of x2.5 x3 of all the files sent (large estimation).

It is advisable to separate:

* The database on another VM
* `PREVIEW_FOLDER` directory on a separate volume

This simplifies migration/augmentation of volumes.
