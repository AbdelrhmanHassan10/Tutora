import sys

file_path = r'D:\Testing\Project\Ancient-arts\Ancient-art.html'
start_line = 145
end_line = 286

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = lines[:start_line-1] + lines[end_line:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Successfully removed lines {start_line} to {end_line}")
