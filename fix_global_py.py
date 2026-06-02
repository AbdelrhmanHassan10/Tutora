import sys

try:
    with open('global-lang.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the literal characters "\n" with actual newline characters
    content = content.replace('\\n', '\n')

    with open('global-lang.js', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed global-lang.js")
except Exception as e:
    print(f"Error: {e}")
