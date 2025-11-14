// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item affix "><li class="part-title">SwiftUI Fundamentals</li><li class="chapter-item "><a href="fundamentals/view-composition.html"><strong aria-hidden="true">1.</strong> View Composition Patterns</a></li><li class="chapter-item "><a href="fundamentals/state-management.html"><strong aria-hidden="true">2.</strong> State Management Architecture</a></li><li class="chapter-item "><a href="fundamentals/navigation.html"><strong aria-hidden="true">3.</strong> Navigation &amp; Routing</a></li><li class="chapter-item "><a href="fundamentals/data-flow.html"><strong aria-hidden="true">4.</strong> Data Flow &amp; Binding</a></li><li class="chapter-item "><a href="fundamentals/environment.html"><strong aria-hidden="true">5.</strong> Environment &amp; Dependency Injection</a></li><li class="chapter-item affix "><li class="part-title">Performance &amp; Architecture</li><li class="chapter-item "><a href="performance/memory-optimization.html"><strong aria-hidden="true">6.</strong> Memory-Efficient Views</a></li><li class="chapter-item "><a href="performance/lazy-loading.html"><strong aria-hidden="true">7.</strong> Lazy Loading &amp; Virtualization</a></li><li class="chapter-item "><a href="performance/background-processing.html"><strong aria-hidden="true">8.</strong> Background Processing</a></li><li class="chapter-item "><a href="performance/caching.html"><strong aria-hidden="true">9.</strong> Caching Strategies</a></li><li class="chapter-item "><a href="performance/monitoring.html"><strong aria-hidden="true">10.</strong> Performance Monitoring</a></li><li class="chapter-item affix "><li class="part-title">Advanced UI Patterns</li><li class="chapter-item "><a href="advanced-ui/animations.html"><strong aria-hidden="true">11.</strong> Custom Animations</a></li><li class="chapter-item "><a href="advanced-ui/gestures.html"><strong aria-hidden="true">12.</strong> Gesture Recognition</a></li><li class="chapter-item "><a href="advanced-ui/drawing.html"><strong aria-hidden="true">13.</strong> Custom Drawing &amp; Graphics</a></li><li class="chapter-item "><a href="advanced-ui/layout.html"><strong aria-hidden="true">14.</strong> Layout System Mastery</a></li><li class="chapter-item "><a href="advanced-ui/accessibility.html"><strong aria-hidden="true">15.</strong> Accessibility Excellence</a></li><li class="chapter-item affix "><li class="part-title">Production Deployment</li><li class="chapter-item "><a href="production/error-handling.html"><strong aria-hidden="true">16.</strong> Error Handling &amp; Recovery</a></li><li class="chapter-item "><a href="production/offline-support.html"><strong aria-hidden="true">17.</strong> Offline Support</a></li><li class="chapter-item "><a href="production/monetization.html"><strong aria-hidden="true">18.</strong> Monetization Integration</a></li><li class="chapter-item "><a href="production/testing.html"><strong aria-hidden="true">19.</strong> Testing Strategies</a></li><li class="chapter-item "><a href="production/debugging.html"><strong aria-hidden="true">20.</strong> Debugging &amp; Profiling</a></li><li class="chapter-item affix "><li class="part-title">Real-World Projects</li><li class="chapter-item "><a href="projects/social-feed.html"><strong aria-hidden="true">21.</strong> Social Media Feed</a></li><li class="chapter-item "><a href="projects/ecommerce.html"><strong aria-hidden="true">22.</strong> E-commerce App</a></li><li class="chapter-item "><a href="projects/productivity.html"><strong aria-hidden="true">23.</strong> Productivity Suite</a></li><li class="chapter-item "><a href="projects/media-player.html"><strong aria-hidden="true">24.</strong> Media Player</a></li><li class="chapter-item affix "><li class="part-title">Component Library</li><li class="chapter-item "><a href="components/reusable.html"><strong aria-hidden="true">25.</strong> Reusable Components</a></li><li class="chapter-item "><a href="components/custom-controls.html"><strong aria-hidden="true">26.</strong> Custom Controls</a></li><li class="chapter-item "><a href="components/animations.html"><strong aria-hidden="true">27.</strong> Animation Library</a></li><li class="chapter-item "><a href="components/layout-helpers.html"><strong aria-hidden="true">28.</strong> Layout Helpers</a></li><li class="chapter-item affix "><li class="part-title">Advanced Topics</li><li class="chapter-item "><a href="advanced/uikit-integration.html"><strong aria-hidden="true">29.</strong> SwiftUI + UIKit Integration</a></li><li class="chapter-item "><a href="advanced/view-modifiers.html"><strong aria-hidden="true">30.</strong> Custom View Modifiers</a></li><li class="chapter-item "><a href="advanced/preference-keys.html"><strong aria-hidden="true">31.</strong> Preference Keys &amp; Anchors</a></li><li class="chapter-item "><a href="advanced/metal-graphics.html"><strong aria-hidden="true">32.</strong> Metal &amp; Core Graphics</a></li><li class="chapter-item affix "><li class="part-title">Business Integration</li><li class="chapter-item "><a href="business/paywall-patterns.html"><strong aria-hidden="true">33.</strong> Paywall Patterns</a></li><li class="chapter-item "><a href="business/ab-testing.html"><strong aria-hidden="true">34.</strong> A/B Testing UI</a></li><li class="chapter-item "><a href="business/analytics.html"><strong aria-hidden="true">35.</strong> Analytics Integration</a></li><li class="chapter-item "><a href="business/onboarding.html"><strong aria-hidden="true">36.</strong> User Onboarding</a></li><li class="chapter-item affix "><li class="part-title">Platform Specific</li><li class="chapter-item "><a href="platform/ios.html"><strong aria-hidden="true">37.</strong> iOS Specific Features</a></li><li class="chapter-item "><a href="platform/macos.html"><strong aria-hidden="true">38.</strong> macOS Adaptations</a></li><li class="chapter-item "><a href="platform/watchos.html"><strong aria-hidden="true">39.</strong> watchOS Considerations</a></li><li class="chapter-item "><a href="platform/visionos.html"><strong aria-hidden="true">40.</strong> visionOS Spatial UI</a></li><li class="chapter-item affix "><li class="part-title">Resources &amp; Tools</li><li class="chapter-item "><a href="resources/setup.html"><strong aria-hidden="true">41.</strong> Development Setup</a></li><li class="chapter-item "><a href="resources/debugging-tools.html"><strong aria-hidden="true">42.</strong> Debugging Tools</a></li><li class="chapter-item "><a href="resources/performance-tools.html"><strong aria-hidden="true">43.</strong> Performance Tools</a></li><li class="chapter-item "><a href="resources/design.html"><strong aria-hidden="true">44.</strong> Design Resources</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
