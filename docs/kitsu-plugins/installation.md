# Kitsu Plugin Installation

## 1. Download your plugin folder

## 2. Install your plugin

```
python zou/cli.py install-plugin --path ./plugin-name
```

Or point directly to the git repository:

```
python zou/cli.py install-plugin --path https://github.com/your-stuido/your-plugin.git
```

## 3. Restart your Zou server

All added routes will live under the path `plugins/plugin-name`.
