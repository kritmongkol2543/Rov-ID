from __future__ import annotations

from io import BytesIO
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from PIL import Image

PAGE = "https://rov.in.th/hero/hayate"
OUT = Path("assets")
UA = {"User-Agent": "Mozilla/5.0 (compatible; ROV-ID-Mockup/1.0)"}


def image_urls(soup: BeautifulSoup):
    seen = set()
    urls = []
    for img in soup.find_all("img"):
        for key in ("src", "data-src", "data-original"):
            raw = img.get(key)
            if not raw:
                continue
            u = urljoin(PAGE, raw)
            if "cdn-webth.garenanow.com" not in u:
                continue
            if u not in seen:
                seen.add(u)
                urls.append(u)
    return urls


def download_image(url: str):
    r = requests.get(url, headers=UA, timeout=25)
    r.raise_for_status()
    im = Image.open(BytesIO(r.content))
    im.load()
    return im


def save_hero(urls):
    candidates = []
    for u in urls[:16]:
        try:
            im = download_image(u)
            w, h = im.size
            if max(w, h) >= 700 and min(w, h) >= 280:
                candidates.append((w * h, u, im.copy()))
        except Exception:
            pass
    if not candidates:
        raise RuntimeError("No suitable hero artwork found on official RoV page")
    _, _, im = max(candidates, key=lambda x: x[0])
    im = im.convert("RGB")
    im.thumbnail((1800, 1200), Image.Resampling.LANCZOS)
    im.save(OUT / "rov-hero.jpg", quality=78, optimize=True, progressive=True)


def recommended_item_urls(soup, all_urls):
    marker = soup.find(string=lambda s: isinstance(s, str) and s.strip() == "แนะนำ")
    ordered = []
    if marker:
        for img in marker.parent.find_all_next("img", limit=14):
            raw = img.get("src") or img.get("data-src") or img.get("data-original")
            if not raw:
                continue
            u = urljoin(PAGE, raw)
            if "cdn-webth.garenanow.com" in u and u not in ordered:
                ordered.append(u)
    for u in all_urls:
        if u not in ordered:
            ordered.append(u)
    return ordered


def save_items(urls):
    saved = 0
    for u in urls:
        if saved >= 4:
            break
        try:
            im = download_image(u)
            w, h = im.size
            ratio = w / h if h else 0
            if not (40 <= min(w, h) <= 512 and 0.65 <= ratio <= 1.55):
                continue
            im = im.convert("RGBA")
            im.thumbnail((220, 220), Image.Resampling.LANCZOS)
            saved += 1
            im.save(OUT / f"rov-item-{saved}.png", optimize=True)
        except Exception:
            pass
    if saved < 4:
        raise RuntimeError(f"Only found {saved} suitable RoV item images")


def main():
    OUT.mkdir(exist_ok=True)
    r = requests.get(PAGE, headers=UA, timeout=25)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    urls = image_urls(soup)
    if not urls:
        raise RuntimeError("Official RoV page returned no CDN image URLs")
    save_hero(urls)
    save_items(recommended_item_urls(soup, urls))
    print("Saved public mockup assets:")
    for p in sorted(OUT.glob("rov-*")):
        print(p, p.stat().st_size)


if __name__ == "__main__":
    main()
