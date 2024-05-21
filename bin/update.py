import re
import sys
import argparse

def update_version(file: str, version: str, regex: str):
    with open(file, 'r') as f:
        content = f.read()
    content = re.sub(regex, version, content)

    with open(file, 'w') as f:
        f.write(content)

def run(version: str):
    # update version in manifest.json
    update_version('browser/chrome/manifest.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')
    update_version('browser/firefox/manifest.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')
    update_version('browser/safari/manifest.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')
    
    # update version in package.json
    update_version('package.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')

    # update version in Xcode project
    update_version("browser/safari/Misstter/Misstter.xcodeproj/project.pbxproj", f"\\1 {version}", r'(MARKETING_VERSION =)\s*\d+\.\d+\.\d+')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Update version in manifest.json and package.json')
    parser.add_argument('version', metavar='version', type=str, help='version to update to')
    args = parser.parse_args()

    version = args.version

    if not re.match(r'\d+\.\d+\.\d+', version):
        raise Exception('Invalid version')
    
    run(version)

