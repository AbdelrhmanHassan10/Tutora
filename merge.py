import os

base_dir = r"d:\Testing\Project"
f1 = os.path.join(base_dir, "Tutora_Comprehensive_Documentation_EN.md")
f2 = os.path.join(base_dir, "Tutora_Comprehensive_Documentation_EN_Part2.md")
f3 = os.path.join(base_dir, "Tutora_Comprehensive_Documentation_EN_Part3.md")

with open(f1, 'a', encoding='utf-8') as outfile:
    with open(f2, 'r', encoding='utf-8') as infile2:
        outfile.write('\n\n')
        outfile.write(infile2.read())
    with open(f3, 'r', encoding='utf-8') as infile3:
        outfile.write('\n\n')
        outfile.write(infile3.read())

# clean up
os.remove(f2)
os.remove(f3)
print("Merge complete.")
