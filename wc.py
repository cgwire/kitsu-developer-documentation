import os
import re
import sys


def remove_code_blocks(text):
    """Remove fenced and inline code from markdown text."""
    # Remove fenced code blocks: ```lang ... ```
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    # Remove inline code: `code`
    text = re.sub(r"`[^`]+`", "", text)
    return text


def count_words_in_text(text):
    """Count words in cleaned text."""
    words = re.findall(r"\b\w+\b", text)
    return len(words)


def count_words_in_markdown_file(file_path):
    """Read markdown file, strip code blocks, and count words."""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    cleaned_text = remove_code_blocks(content)
    return count_words_in_text(cleaned_text)


def count_words_in_folder(folder_path):
    total_words = 0
    print(f"📁 Scanning folder: {folder_path}\n")
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(".md"):
                file_path = os.path.join(root, file)
                try:
                    word_count = count_words_in_markdown_file(file_path)
                    total_words += word_count
                    print(f"{file_path}: {word_count} words")
                except Exception as e:
                    print(f"⚠️ Error reading {file_path}: {e}")
    print(f"\n🧮 Total word count (excluding code blocks): {total_words}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python wc.py <folder_path>")
        sys.exit(1)

    folder = sys.argv[1]
    if not os.path.isdir(folder):
        print(f"❌ Invalid folder path: {folder}")
        sys.exit(1)

    count_words_in_folder(folder)
