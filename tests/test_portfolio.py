#!/usr/bin/env python3
"""
Unit Test Suite for Portfolio Website
Validates HTML structure, navigation anchor validity, URL sanitization logic,
Kanso showcase modal components, static assets, and OpenGraph metadata.
"""

import os
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

PORTFOLIO_DIR = Path(__file__).resolve().parent.parent

class AnchorAndIdCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.internal_anchors = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if "id" in attr_dict:
            self.ids.add(attr_dict["id"])
        if tag == "a" and "href" in attr_dict:
            href = attr_dict["href"]
            if href.startswith("#") and len(href) > 1:
                self.internal_anchors.append(href[1:])
        if tag == "img" and "src" in attr_dict:
            self.images.append(attr_dict["src"])


class TestPortfolioWebsite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index_path = PORTFOLIO_DIR / "index.html"
        cls.js_path = PORTFOLIO_DIR / "js" / "main.js"
        cls.css_path = PORTFOLIO_DIR / "css" / "style.css"
        cls.kanso_page_path = PORTFOLIO_DIR / "kanso" / "index.html"
        cls.blog_path = PORTFOLIO_DIR / "blogs" / "what-are-embeddings.html"

        with open(cls.index_path, "r", encoding="utf-8") as f:
            cls.index_html = f.read()

        cls.collector = AnchorAndIdCollector()
        cls.collector.feed(cls.index_html)

    def test_core_files_exist(self):
        """Ensure all required core files and directories exist."""
        self.assertTrue(self.index_path.is_file(), "index.html must exist")
        self.assertTrue(self.js_path.is_file(), "js/main.js must exist")
        self.assertTrue(self.css_path.is_file(), "css/style.css must exist")
        self.assertTrue(self.kanso_page_path.is_file(), "kanso/index.html must exist")
        self.assertTrue(self.blog_path.is_file(), "blogs/what-are-embeddings.html must exist")

    def test_html_document_structure(self):
        """Validate critical HTML document tags and metadata in index.html."""
        self.assertIn("<!DOCTYPE html>", self.index_html)
        self.assertIn('<html lang="en"', self.index_html)
        self.assertIn("Nithin Pathikonda", self.index_html)
        self.assertIn("og:title", self.index_html)
        self.assertIn("og:image", self.index_html)
        self.assertIn("twitter:card", self.index_html)

    def test_semantic_sections_exist(self):
        """Ensure all primary portfolio sections exist as element IDs in index.html."""
        required_sections = [
            "home",
            "about",
            "skills",
            "experience",
            "projects",
            "kanso-showcase",
            "blogs",
            "contact"
        ]
        for section_id in required_sections:
            self.assertIn(
                section_id,
                self.collector.ids,
                f"Missing required section id='{section_id}' in index.html"
            )

    def test_navigation_anchors_have_matching_ids(self):
        """Ensure every internal anchor (<a href='#section'>) links to a valid id in the DOM."""
        for target_id in self.collector.internal_anchors:
            self.assertIn(
                target_id,
                self.collector.ids,
                f"Broken navigation link: anchor '#{target_id}' has no matching element id"
            )

    def test_kanso_modal_elements_exist(self):
        """Validate that all interactive Kanso showcase lightbox modal IDs exist."""
        required_modal_ids = [
            "kansoModal",
            "kansoSlideImg",
            "kansoSlideBadge",
            "kansoSlideTitle",
            "kansoSlideDesc",
            "kansoSlideBullets",
            "kansoTab0",
            "kansoTab1",
            "kansoTab2",
            "kansoTab3"
        ]
        for modal_id in required_modal_ids:
            self.assertIn(
                modal_id,
                self.collector.ids,
                f"Missing Kanso modal element id='{modal_id}' in index.html"
            )

    def test_url_sanitizer_in_head(self):
        """Validate that the <head> contains immediate query parameter sanitization."""
        head_match = re.search(r"<head>(.*?)</head>", self.index_html, re.DOTALL | re.IGNORECASE)
        self.assertIsNotNone(head_match, "<head> block must exist")
        head_content = head_match.group(1)

        self.assertIn("project=kanso", head_content, "Sanitizer must check for project=kanso")
        self.assertIn("replaceState", head_content, "Sanitizer must invoke replaceState to clean URL")
        self.assertIn("#kanso-showcase", head_content, "Sanitizer must direct to #kanso-showcase fragment")

    def test_js_main_contains_modal_controller(self):
        """Validate that js/main.js contains modal management and query parameter scrubbing."""
        with open(self.js_path, "r", encoding="utf-8") as f:
            js_content = f.read()

        self.assertIn("openKansoModal", js_content)
        self.assertIn("closeKansoModal", js_content)
        self.assertIn("switchKansoSlide", js_content)
        self.assertIn("kansoSlides", js_content)
        self.assertIn("window.openKansoModal = openKansoModal", js_content)
        self.assertIn("window.closeKansoModal = closeKansoModal", js_content)

        # Verify all 4 mockups are registered
        expected_mockups = [
            "assets/kanso/routines.png",
            "assets/kanso/matrix.png",
            "assets/kanso/analytics.png",
            "assets/kanso/widgets.png"
        ]
        for mockup in expected_mockups:
            self.assertIn(mockup, js_content, f"Mockup '{mockup}' missing from kansoSlides in js/main.js")

    def test_static_assets_exist_and_non_empty(self):
        """Ensure all required images and assets exist on disk and have non-zero file sizes."""
        required_assets = [
            "assets/kanso/routines.png",
            "assets/kanso/matrix.png",
            "assets/kanso/analytics.png",
            "assets/kanso/widgets.png",
            "assets/kanso-preview.jpg",
            "assets/og-preview.jpg",
            "favicon.ico",
            "assets/favicon.png",
            "assets/favicon.svg"
        ]
        for asset_rel in required_assets:
            asset_path = PORTFOLIO_DIR / asset_rel
            self.assertTrue(asset_path.is_file(), f"Asset '{asset_rel}' does not exist on disk")
            self.assertGreater(asset_path.stat().st_size, 0, f"Asset '{asset_rel}' must not be empty (0 bytes)")

    def test_kanso_standalone_landing_page(self):
        """Validate /kanso/index.html deep-link page has proper redirects and OpenGraph tags."""
        with open(self.kanso_page_path, "r", encoding="utf-8") as f:
            kanso_html = f.read()

        self.assertIn("og:title", kanso_html)
        self.assertIn("og:image", kanso_html)
        self.assertIn("http-equiv=\"refresh\"", kanso_html)
        self.assertIn("kanso-preview.jpg", kanso_html)
        self.assertIn("window.location.replace", kanso_html)

    def test_blog_what_are_embeddings(self):
        """Validate blogs/what-are-embeddings.html exists and contains valid navigational structure."""
        with open(self.blog_path, "r", encoding="utf-8") as f:
            blog_html = f.read()

        self.assertIn("Embeddings", blog_html)
        self.assertIn("Nithin Pathikonda", blog_html)
        # Should link back to main portfolio
        self.assertTrue(
            "../#blogs" in blog_html or "../" in blog_html or "https://nithinpathikonda.github.io/" in blog_html,
            "Blog should link back to main portfolio"
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
