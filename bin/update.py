import re
import sys

def update_version(file: str, version: str, regex: str):
    with open(file, 'r') as f:
        content = f.read()
    content = re.sub(regex, version, content)

    with open(file, 'w') as f:
        f.write(content)

if __name__ == '__main__':
    version = sys.argv[1]

    if not re.match(r'\d+\.\d+\.\d+', version):
        raise Exception('Invalid version')

    # update version in manifest.json
    update_version('browser/chrome/manifest.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')
    update_version('browser/firefox/manifest.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')
    update_version('browser/safari/manifest.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')
    
    # update version in package.json
    update_version('package.json', f"\\1\"{version}", r'("version":\s*)"\d+\.\d+\.\d+')

    # update version in Xcode project
    update_version("browser/safari/Misstter/Misstter.xcodeproj/project.pbxproj", f"\\1 {version}", r'(MARKETING_VERSION =)\s*\d+\.\d+\.\d+')

