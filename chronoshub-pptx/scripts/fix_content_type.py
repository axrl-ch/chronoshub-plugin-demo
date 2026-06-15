#!/usr/bin/env python3
"""
Fix content type in an unpacked ChronosHub presentation directory.

The ChronosHub template is a .potx file. When unpacked, its [Content_Types].xml
declares the presentation as type 'template.main+xml'. This must be patched to
'presentation.main+xml' before packing, otherwise PowerPoint refuses to open it.

Usage:
    python fix_content_type.py <unpacked_dir>

Example:
    python fix_content_type.py /tmp/chronoshub-unpacked/
"""

import sys
import os

def fix(unpacked_dir):
    ct_path = os.path.join(unpacked_dir, "[Content_Types].xml")
    if not os.path.exists(ct_path):
        print(f"ERROR: {ct_path} not found")
        sys.exit(1)

    with open(ct_path, "r", encoding="utf-8") as f:
        content = f.read()

    old = "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"
    new = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"

    if old not in content:
        if new in content:
            print("Content type already correct — nothing to do.")
        else:
            print("WARNING: Neither template nor presentation content type found. Check [Content_Types].xml manually.")
        return

    content = content.replace(old, new)
    with open(ct_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Fixed: patched [Content_Types].xml in {unpacked_dir}")
    print(f"  {old}")
    print(f"  → {new}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    fix(sys.argv[1])
