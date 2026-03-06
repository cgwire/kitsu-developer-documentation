# Progress Callbacks

Gazu supports progress callbacks on all file upload and download functions.
This lets you display progress bars, log transfer status, or update a UI
during long operations.

## How it works

The callback receives two arguments on each chunk transferred:

| Argument | Type | Description |
|---|---|---|
| `bytes_read` | int | Number of bytes transferred so far |
| `total` | int | Total file size in bytes (0 if unknown) |

For uploads, the total is computed from the file size on disk. For downloads,
it comes from the `Content-Length` response header (which may be absent for
streamed responses, in which case `total` is 0).

## Basic example

```python
import gazu

gazu.set_host("http://localhost/api")
gazu.log_in("admin@example.com", "mysecretpassword")

def on_progress(bytes_read, total):
    if total > 0:
        pct = bytes_read / total * 100
        print(f"\r{pct:.1f}% ({bytes_read}/{total} bytes)", end="", flush=True)
    else:
        print(f"\r{bytes_read} bytes transferred", end="", flush=True)

# Download a preview with progress
preview_file = gazu.files.get_preview_file(preview_file_id)
gazu.files.download_preview_file(
    preview_file,
    "./render_v003.mp4",
    progress_callback=on_progress,
)
print()  # newline after progress
```

## Upload with progress

The callback works the same way for uploads. When uploading multiple files
in a single call (e.g. comment attachments), `total` is the combined size of
all files.

```python
# Upload a working file
working_file = gazu.files.new_working_file(task, name="main", software=software)
gazu.files.upload_working_file(
    working_file,
    "/path/to/scene.blend",
    progress_callback=on_progress,
)

# Upload a preview
comment = gazu.task.add_comment(task, wip, "New render")
preview = gazu.task.upload_preview_file(
    comment,
    "/path/to/render.mp4",
    progress_callback=on_progress,
)
```

## Using tqdm

[tqdm](https://github.com/tqdm/tqdm) provides ready-made progress bars for
terminals and notebooks:

```python
from tqdm import tqdm

progress_bar = None

def tqdm_callback(bytes_read, total):
    global progress_bar
    if progress_bar is None:
        progress_bar = tqdm(total=total, unit="B", unit_scale=True)
    progress_bar.update(bytes_read - progress_bar.n)

gazu.files.download_preview_file(
    preview_file,
    "./render.mp4",
    progress_callback=tqdm_callback,
)
progress_bar.close()
progress_bar = None
```

## Batch downloads with progress

When downloading many files, you can combine a per-file progress callback with
an outer loop to track overall progress:

```python
from tqdm import tqdm

project = gazu.project.get_project_by_name("My Project")
tasks = gazu.task.all_tasks_for_project(project)
comments_with_previews = []

for task in tasks:
    for comment in gazu.task.all_comments_for_task(task):
        for preview in comment.get("previews", []):
            comments_with_previews.append(preview)

for i, preview in enumerate(comments_with_previews, 1):
    print(f"[{i}/{len(comments_with_previews)}] {preview['id']}")
    gazu.files.download_preview_file(
        preview,
        f"./downloads/{preview['id']}.mp4",
        progress_callback=on_progress,
    )
    print()
```

## Supported functions

All upload and download functions in gazu accept `progress_callback`:

**Uploads:**

| Function | Description |
|---|---|
| `gazu.files.upload_working_file` | Upload a working file |
| `gazu.files.upload_person_avatar` | Upload a person avatar |
| `gazu.files.upload_project_avatar` | Upload a project thumbnail |
| `gazu.files.upload_organisation_avatar` | Upload an organisation logo |
| `gazu.task.upload_preview_file` | Upload a preview file |
| `gazu.task.add_comment` | Post a comment (with attachments) |
| `gazu.task.add_attachment_files_to_comment` | Add attachments to an existing comment |

**Downloads:**

| Function | Description |
|---|---|
| `gazu.files.download_working_file` | Download a working file |
| `gazu.files.download_preview_file` | Download a preview (original) |
| `gazu.files.download_preview_file_thumbnail` | Download a preview thumbnail |
| `gazu.files.download_preview_file_cover` | Download a preview cover image |
| `gazu.files.download_preview_movie` | Download a preview movie |
| `gazu.files.download_preview_lowdef_movie` | Download a low-definition preview movie |
| `gazu.files.download_attachment_file` | Download a comment attachment |
| `gazu.files.download_attachment_thumbnail` | Download an attachment thumbnail |
| `gazu.files.download_person_avatar` | Download a person avatar |
| `gazu.files.download_project_avatar` | Download a project thumbnail |
| `gazu.files.download_organisation_avatar` | Download an organisation logo |
| `gazu.files.extract_frame_from_preview` | Extract a single frame from a video preview |
| `gazu.files.extract_tile_from_preview` | Extract a tile image from a preview |
