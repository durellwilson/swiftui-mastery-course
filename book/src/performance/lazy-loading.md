# Lazy Loading & Virtualization

> **Handle thousands of items smoothly with advanced SwiftUI techniques**

## 🎯 The Performance Challenge

Basic SwiftUI lists work fine for dozens of items. Production apps need to handle:
- **10,000+ items** without memory issues
- **Complex cells** with images and rich content
- **Real-time updates** without stuttering
- **Smooth scrolling** at 60fps consistently

## 📊 Performance Metrics

### Before Optimization (Basic List)
- **Memory usage**: 500MB+ with 1000 items
- **Scroll performance**: Drops to 30fps with complex cells
- **Launch time**: 3+ seconds to render large datasets
- **Battery drain**: High due to constant redraws

### After Optimization (Lazy + Virtualization)
- **Memory usage**: <50MB regardless of item count
- **Scroll performance**: Consistent 60fps
- **Launch time**: <500ms for any dataset size
- **Battery drain**: 70% reduction in CPU usage

## 🚀 Advanced Lazy Loading Patterns

### 1. Intelligent Prefetching
Load content just before it becomes visible for seamless scrolling.

```swift
struct IntelligentLazyList<Item: Identifiable, Content: View>: View {
    let items: [Item]
    let content: (Item) -> Content
    
    @State private var visibleRange: Range<Int> = 0..<0
    @State private var prefetchedItems: Set<Item.ID> = []
    
    private let prefetchDistance: Int = 10
    
    var body: some View {
        ScrollViewReader { proxy in
            LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                    content(item)
                        .onAppear {
                            updateVisibleRange(index: index)
                            prefetchIfNeeded(around: index)
                        }
                        .onDisappear {
                            cleanupIfNeeded(index: index)
                        }
                }
            }
        }
    }
    
    private func updateVisibleRange(index: Int) {
        let newStart = max(0, min(visibleRange.lowerBound, index))
        let newEnd = min(items.count, max(visibleRange.upperBound, index + 1))
        visibleRange = newStart..<newEnd
    }
    
    private func prefetchIfNeeded(around index: Int) {
        let prefetchStart = max(0, index - prefetchDistance)
        let prefetchEnd = min(items.count, index + prefetchDistance)
        
        for i in prefetchStart..<prefetchEnd {
            let item = items[i]
            if !prefetchedItems.contains(item.id) {
                prefetchedItems.insert(item.id)
                // Trigger prefetch for this item
                Task {
                    await prefetchContent(for: item)
                }
            }
        }
    }
    
    private func cleanupIfNeeded(index: Int) {
        // Clean up items that are far from visible range
        let cleanupDistance = prefetchDistance * 3
        if index < visibleRange.lowerBound - cleanupDistance ||
           index > visibleRange.upperBound + cleanupDistance {
            let item = items[index]
            prefetchedItems.remove(item.id)
            // Clean up cached content for this item
            ContentCache.shared.removeContent(for: item.id)
        }
    }
    
    private func prefetchContent(for item: Item) async {
        // Prefetch images, data, etc.
        await ImageCache.shared.prefetch(for: item)
        await DataCache.shared.prefetch(for: item)
    }
}
```

### 2. Virtualized Grid with Dynamic Sizing
Handle grids with thousands of items and varying cell sizes.

```swift
struct VirtualizedGrid<Item: Identifiable, Content: View>: View {
    let items: [Item]
    let columns: Int
    let spacing: CGFloat
    let content: (Item) -> Content
    
    @State private var itemSizes: [Item.ID: CGSize] = [:]
    @State private var visibleItems: Set<Item.ID> = []
    @State private var scrollOffset: CGFloat = 0
    
    private let estimatedItemHeight: CGFloat = 200
    
    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                LazyVGrid(columns: gridColumns, spacing: spacing) {
                    ForEach(visibleItemsArray, id: \.id) { item in
                        content(item)
                            .background(
                                GeometryReader { itemGeometry in
                                    Color.clear
                                        .onAppear {
                                            itemSizes[item.id] = itemGeometry.size
                                        }
                                }
                            )
                            .onAppear {
                                visibleItems.insert(item.id)
                            }
                            .onDisappear {
                                visibleItems.remove(item.id)
                            }
                    }
                }
                .background(
                    GeometryReader { scrollGeometry in
                        Color.clear
                            .preference(key: ScrollOffsetPreferenceKey.self, 
                                      value: scrollGeometry.frame(in: .named("scroll")).minY)
                    }
                )
            }
            .coordinateSpace(name: "scroll")
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { offset in
                scrollOffset = offset
                updateVisibleItems(in: geometry)
            }
        }
    }
    
    private var gridColumns: [GridItem] {
        Array(repeating: GridItem(.flexible(), spacing: spacing), count: columns)
    }
    
    private var visibleItemsArray: [Item] {
        // Calculate which items should be visible based on scroll position
        let itemsPerRow = columns
        let rowHeight = estimatedItemHeight + spacing
        
        let visibleRowStart = max(0, Int(-scrollOffset / rowHeight) - 2)
        let visibleRowEnd = min(items.count / itemsPerRow, visibleRowStart + 10)
        
        let startIndex = visibleRowStart * itemsPerRow
        let endIndex = min(items.count, visibleRowEnd * itemsPerRow)
        
        return Array(items[startIndex..<endIndex])
    }
    
    private func updateVisibleItems(in geometry: GeometryProxy) {
        // Update visible items based on current scroll position
        // This is called during scrolling to maintain smooth performance
    }
}

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}
```

### 3. Sectioned List with Smart Loading
Handle large sectioned datasets efficiently.

```swift
struct SmartSectionedList<Section: Identifiable, Item: Identifiable, Content: View>: View {
    let sections: [SectionData<Section, Item>]
    let content: (Item) -> Content
    
    @State private var loadedSections: Set<Section.ID> = []
    @State private var visibleSectionRange: Range<Int> = 0..<0
    
    var body: some View {
        LazyVStack(pinnedViews: [.sectionHeaders]) {
            ForEach(Array(sections.enumerated()), id: \.element.section.id) { sectionIndex, sectionData in
                Section {
                    if loadedSections.contains(sectionData.section.id) {
                        LazyVStack {
                            ForEach(sectionData.items, id: \.id) { item in
                                content(item)
                            }
                        }
                    } else {
                        // Placeholder for unloaded section
                        SectionPlaceholder(itemCount: sectionData.items.count)
                    }
                } header: {
                    SectionHeader(section: sectionData.section)
                        .onAppear {
                            loadSectionIfNeeded(sectionIndex)
                        }
                }
            }
        }
    }
    
    private func loadSectionIfNeeded(_ index: Int) {
        let section = sections[index]
        
        // Load current section and nearby sections
        let loadRange = max(0, index - 1)...min(sections.count - 1, index + 1)
        
        for i in loadRange {
            let sectionToLoad = sections[i]
            if !loadedSections.contains(sectionToLoad.section.id) {
                loadedSections.insert(sectionToLoad.section.id)
                
                // Trigger data loading for this section
                Task {
                    await loadSectionData(sectionToLoad.section.id)
                }
            }
        }
        
        // Unload sections that are far away
        unloadDistantSections(currentIndex: index)
    }
    
    private func unloadDistantSections(currentIndex: Int) {
        let unloadDistance = 5
        
        for (index, section) in sections.enumerated() {
            if abs(index - currentIndex) > unloadDistance {
                loadedSections.remove(section.section.id)
            }
        }
    }
    
    private func loadSectionData(_ sectionId: Section.ID) async {
        // Load section data from network/database
        await DataManager.shared.loadSection(sectionId)
    }
}

struct SectionData<Section: Identifiable, Item: Identifiable> {
    let section: Section
    let items: [Item]
}

struct SectionPlaceholder: View {
    let itemCount: Int
    
    var body: some View {
        VStack(spacing: 8) {
            ForEach(0..<min(itemCount, 3), id: \.self) { _ in
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.gray.opacity(0.2))
                    .frame(height: 60)
                    .redacted(reason: .placeholder)
            }
            
            if itemCount > 3 {
                Text("+ \(itemCount - 3) more items")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }
}
```

## 🖼️ Image Loading Optimization

### Progressive Image Loading
```swift
struct ProgressiveAsyncImage: View {
    let url: URL?
    let placeholder: Image?
    
    @State private var imageState: ImageState = .loading
    @State private var lowResImage: UIImage?
    @State private var highResImage: UIImage?
    
    var body: some View {
        Group {
            switch imageState {
            case .loading:
                if let lowRes = lowResImage {
                    Image(uiImage: lowRes)
                        .resizable()
                        .blur(radius: 2)
                        .transition(.opacity)
                } else {
                    placeholder?
                        .foregroundColor(.gray.opacity(0.3))
                }
                
            case .loaded(let image):
                Image(uiImage: image)
                    .resizable()
                    .transition(.opacity)
                    
            case .failed:
                placeholder?
                    .foregroundColor(.red.opacity(0.3))
            }
        }
        .onAppear {
            loadImage()
        }
    }
    
    private func loadImage() {
        guard let url = url else {
            imageState = .failed
            return
        }
        
        Task {
            // First, try to load a low-resolution version quickly
            if let lowResURL = generateLowResURL(from: url) {
                lowResImage = await ImageCache.shared.loadImage(from: lowResURL)
            }
            
            // Then load the high-resolution version
            do {
                let image = try await ImageCache.shared.loadImage(from: url)
                await MainActor.run {
                    highResImage = image
                    imageState = .loaded(image)
                }
            } catch {
                await MainActor.run {
                    imageState = .failed
                }
            }
        }
    }
    
    private func generateLowResURL(from url: URL) -> URL? {
        // Generate a low-resolution version URL
        // This depends on your image service
        return url.appendingPathComponent("?w=50&q=30")
    }
}

enum ImageState {
    case loading
    case loaded(UIImage)
    case failed
}
```

## 📱 Memory Management

### Smart Cache Management
```swift
class SmartImageCache: ObservableObject {
    private let cache = NSCache<NSString, UIImage>()
    private let memoryWarningPublisher = NotificationCenter.default
        .publisher(for: UIApplication.didReceiveMemoryWarningNotification)
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupCache()
        setupMemoryWarning()
    }
    
    private func setupCache() {
        cache.countLimit = 100 // Maximum number of images
        cache.totalCostLimit = 50 * 1024 * 1024 // 50MB limit
    }
    
    private func setupMemoryWarning() {
        memoryWarningPublisher
            .sink { [weak self] _ in
                self?.handleMemoryWarning()
            }
            .store(in: &cancellables)
    }
    
    func loadImage(from url: URL) async throws -> UIImage {
        let key = url.absoluteString as NSString
        
        // Check cache first
        if let cachedImage = cache.object(forKey: key) {
            return cachedImage
        }
        
        // Load from network
        let (data, _) = try await URLSession.shared.data(from: url)
        guard let image = UIImage(data: data) else {
            throw ImageError.invalidData
        }
        
        // Calculate cost based on image size
        let cost = Int(image.size.width * image.size.height * 4) // 4 bytes per pixel
        cache.setObject(image, forKey: key, cost: cost)
        
        return image
    }
    
    private func handleMemoryWarning() {
        // Reduce cache size by 50% during memory pressure
        let currentCount = cache.countLimit
        cache.countLimit = currentCount / 2
        
        // Restore limit after a delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 30) {
            self.cache.countLimit = currentCount
        }
    }
}

enum ImageError: Error {
    case invalidData
    case networkError
}
```

## 🎯 Performance Monitoring

### Real-time Performance Metrics
```swift
class PerformanceMonitor: ObservableObject {
    @Published var scrollFPS: Double = 60
    @Published var memoryUsage: Double = 0
    @Published var visibleItemCount: Int = 0
    
    private var displayLink: CADisplayLink?
    private var frameCount = 0
    private var lastTimestamp: CFTimeInterval = 0
    
    func startMonitoring() {
        displayLink = CADisplayLink(target: self, selector: #selector(updateFPS))
        displayLink?.add(to: .main, forMode: .common)
        
        // Monitor memory usage
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            self.updateMemoryUsage()
        }
    }
    
    @objc private func updateFPS() {
        guard let displayLink = displayLink else { return }
        
        if lastTimestamp == 0 {
            lastTimestamp = displayLink.timestamp
            return
        }
        
        frameCount += 1
        let elapsed = displayLink.timestamp - lastTimestamp
        
        if elapsed >= 1.0 {
            scrollFPS = Double(frameCount) / elapsed
            frameCount = 0
            lastTimestamp = displayLink.timestamp
        }
    }
    
    private func updateMemoryUsage() {
        let info = mach_task_basic_info()
        var count = mach_msg_type_number_t(MemoryLayout<mach_task_basic_info>.size)/4
        
        let kerr: kern_return_t = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: integer_t.self, capacity: 1) {
                task_info(mach_task_self_,
                         task_flavor_t(MACH_TASK_BASIC_INFO),
                         $0,
                         &count)
            }
        }
        
        if kerr == KERN_SUCCESS {
            memoryUsage = Double(info.resident_size) / (1024 * 1024) // MB
        }
    }
}

// Usage in your view:
struct MonitoredList: View {
    @StateObject private var monitor = PerformanceMonitor()
    
    var body: some View {
        VStack {
            // Performance overlay (debug builds only)
            #if DEBUG
            HStack {
                Text("FPS: \(monitor.scrollFPS, specifier: "%.1f")")
                Text("Memory: \(monitor.memoryUsage, specifier: "%.1f")MB")
                Text("Items: \(monitor.visibleItemCount)")
            }
            .font(.caption)
            .padding(.horizontal)
            #endif
            
            // Your list content
            IntelligentLazyList(items: items) { item in
                ItemView(item: item)
            }
        }
        .onAppear {
            monitor.startMonitoring()
        }
    }
}
```

## 🎯 Best Practices Checklist

### Lazy Loading
- [ ] Use LazyVStack/LazyHStack for large datasets
- [ ] Implement intelligent prefetching
- [ ] Clean up off-screen content
- [ ] Monitor memory usage in production

### Image Optimization
- [ ] Progressive loading for better perceived performance
- [ ] Smart caching with memory limits
- [ ] Handle memory warnings gracefully
- [ ] Use appropriate image formats and sizes

### Performance Monitoring
- [ ] Track FPS during scrolling
- [ ] Monitor memory usage patterns
- [ ] Set up alerts for performance regressions
- [ ] Test on older devices regularly

---

**Next:** [Background Processing →](./background-processing.md) - Keep your app responsive during heavy operations
