import urllib.request
import re
from html.parser import HTMLParser

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr in attrs:
                if attr[0] == 'href':
                    href = attr[1].lower()
                    if 'http' in href and 'gitbook.io' not in href:
                         self.links.append(attr[1])

url = 'https://openos-labs.gitbook.io/unibase-docs/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        parser = LinkParser()
        parser.feed(html)
        with open("links.txt", "w", encoding="utf-8") as f:
            for link in set(parser.links):
                f.write(link + "\n")
except Exception as e:
    with open("links.txt", "w") as f:
        f.write('Error: ' + str(e))
