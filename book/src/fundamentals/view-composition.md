# View Composition Patterns

> **Build SwiftUI views that scale from prototype to production**

## 🎯 The Composition Problem

Most SwiftUI tutorials show you how to build a single view. Production apps need views that:
- **Compose cleanly** without massive view hierarchies
- **Reuse efficiently** across different contexts
- **Perform well** with complex data and state
- **Test easily** in isolation

## 🏗️ Production Composition Patterns

### 1. Container-Content Pattern
Separate layout logic from content logic for maximum reusability.

```swift
// ❌ Monolithic view - hard to reuse and test
struct ProductCard: View {
    let product: Product
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            AsyncImage(url: product.imageURL) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(height: 200)
            .clipped()
            
            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.headline)
                    .lineLimit(2)
                
                Text(product.price, format: .currency(code: "USD"))
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack {
                    ForEach(0..<5) { star in
                        Image(systemName: star < product.rating ? "star.fill" : "star")
                            .foregroundColor(.yellow)
                    }
                    
                    Text("(\(product.reviewCount))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal)
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

// ✅ Composable pattern - reusable and testable
struct CardContainer<Content: View>: View {
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        content
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .shadow(radius: 2)
    }
}

struct ProductContent: View {
    let product: Product
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ProductImage(url: product.imageURL)
            ProductDetails(product: product)
        }
    }
}

struct ProductImage: View {
    let url: URL?
    
    var body: some View {
        AsyncImage(url: url) { image in
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
        } placeholder: {
            Rectangle()
                .fill(Color.gray.opacity(0.3))
        }
        .frame(height: 200)
        .clipped()
    }
}

struct ProductDetails: View {
    let product: Product
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(product.name)
                .font(.headline)
                .lineLimit(2)
            
            Text(product.price, format: .currency(code: "USD"))
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            RatingView(rating: product.rating, reviewCount: product.reviewCount)
        }
        .padding(.horizontal)
    }
}

// Now you can compose flexibly:
struct ProductCard: View {
    let product: Product
    
    var body: some View {
        CardContainer {
            ProductContent(product: product)
        }
    }
}

// And reuse components in different contexts:
struct ProductListRow: View {
    let product: Product
    
    var body: some View {
        HStack {
            ProductImage(url: product.imageURL)
                .frame(width: 80, height: 80)
            
            ProductDetails(product: product)
            
            Spacer()
        }
    }
}
```

### 2. Configuration-Based Views
Use configuration objects to make views flexible without parameter explosion.

```swift
// ❌ Parameter explosion - becomes unmaintainable
struct Button: View {
    let title: String
    let action: () -> Void
    let backgroundColor: Color
    let foregroundColor: Color
    let cornerRadius: CGFloat
    let padding: EdgeInsets
    let font: Font
    let isEnabled: Bool
    let showLoading: Bool
    let hapticFeedback: Bool
    // ... 20+ more parameters
}

// ✅ Configuration-based approach
struct ButtonConfiguration {
    var backgroundColor: Color = .blue
    var foregroundColor: Color = .white
    var cornerRadius: CGFloat = 8
    var padding: EdgeInsets = EdgeInsets(top: 12, leading: 24, bottom: 12, trailing: 24)
    var font: Font = .body
    var isEnabled: Bool = true
    var showLoading: Bool = false
    var hapticFeedback: Bool = true
    
    // Predefined configurations
    static let primary = ButtonConfiguration()
    static let secondary = ButtonConfiguration(
        backgroundColor: .clear,
        foregroundColor: .blue,
        padding: EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16)
    )
    static let destructive = ButtonConfiguration(backgroundColor: .red)
}

struct ConfigurableButton: View {
    let title: String
    let action: () -> Void
    let configuration: ButtonConfiguration
    
    init(_ title: String, configuration: ButtonConfiguration = .primary, action: @escaping () -> Void) {
        self.title = title
        self.configuration = configuration
        self.action = action
    }
    
    var body: some View {
        Button(action: action) {
            HStack {
                if configuration.showLoading {
                    ProgressView()
                        .scaleEffect(0.8)
                }
                
                Text(title)
                    .font(configuration.font)
            }
            .foregroundColor(configuration.foregroundColor)
            .padding(configuration.padding)
            .background(configuration.backgroundColor)
            .cornerRadius(configuration.cornerRadius)
        }
        .disabled(!configuration.isEnabled)
        .simultaneousGesture(
            TapGesture().onEnded {
                if configuration.hapticFeedback {
                    HapticManager.impact(.medium)
                }
            }
        )
    }
}

// Usage is clean and flexible:
ConfigurableButton("Save", configuration: .primary) { save() }
ConfigurableButton("Cancel", configuration: .secondary) { cancel() }
ConfigurableButton("Delete", configuration: .destructive) { delete() }
```

### 3. Builder Pattern for Complex Views
Use builders for views with many optional components.

```swift
struct ProfileViewBuilder {
    private var avatar: AnyView?
    private var name: String?
    private var subtitle: String?
    private var badges: [Badge] = []
    private var actions: [ProfileAction] = []
    private var showOnlineStatus = false
    
    func avatar<V: View>(@ViewBuilder _ content: () -> V) -> ProfileViewBuilder {
        var builder = self
        builder.avatar = AnyView(content())
        return builder
    }
    
    func name(_ name: String) -> ProfileViewBuilder {
        var builder = self
        builder.name = name
        return builder
    }
    
    func subtitle(_ subtitle: String) -> ProfileViewBuilder {
        var builder = self
        builder.subtitle = subtitle
        return builder
    }
    
    func badges(_ badges: [Badge]) -> ProfileViewBuilder {
        var builder = self
        builder.badges = badges
        return builder
    }
    
    func actions(_ actions: [ProfileAction]) -> ProfileViewBuilder {
        var builder = self
        builder.actions = actions
        return builder
    }
    
    func showOnlineStatus(_ show: Bool = true) -> ProfileViewBuilder {
        var builder = self
        builder.showOnlineStatus = show
        return builder
    }
    
    func build() -> some View {
        ProfileView(
            avatar: avatar,
            name: name,
            subtitle: subtitle,
            badges: badges,
            actions: actions,
            showOnlineStatus: showOnlineStatus
        )
    }
}

// Usage:
ProfileViewBuilder()
    .avatar {
        AsyncImage(url: user.avatarURL)
            .frame(width: 60, height: 60)
            .clipShape(Circle())
    }
    .name(user.displayName)
    .subtitle(user.title)
    .badges(user.badges)
    .actions([.message, .follow, .more])
    .showOnlineStatus()
    .build()
```

## 🎨 Style and Theme Composition

### Environment-Based Theming
```swift
struct AppTheme {
    let primaryColor: Color
    let secondaryColor: Color
    let backgroundColor: Color
    let textColor: Color
    let cornerRadius: CGFloat
    let spacing: CGFloat
    
    static let light = AppTheme(
        primaryColor: .blue,
        secondaryColor: .gray,
        backgroundColor: .white,
        textColor: .black,
        cornerRadius: 8,
        spacing: 16
    )
    
    static let dark = AppTheme(
        primaryColor: .blue,
        secondaryColor: .gray,
        backgroundColor: .black,
        textColor: .white,
        cornerRadius: 8,
        spacing: 16
    )
}

struct ThemeKey: EnvironmentKey {
    static let defaultValue = AppTheme.light
}

extension EnvironmentValues {
    var theme: AppTheme {
        get { self[ThemeKey.self] }
        set { self[ThemeKey.self] = newValue }
    }
}

// Usage in views:
struct ThemedButton: View {
    @Environment(\.theme) private var theme
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .foregroundColor(theme.textColor)
                .padding()
                .background(theme.primaryColor)
                .cornerRadius(theme.cornerRadius)
        }
    }
}
```

## 🔧 Performance-Optimized Composition

### View Identity and Stability
```swift
// ❌ Unstable view identity - causes unnecessary redraws
struct ProductList: View {
    let products: [Product]
    
    var body: some View {
        LazyVStack {
            ForEach(products, id: \.id) { product in
                // This creates a new view type for each product
                VStack {
                    Text(product.name)
                    Text(product.price.formatted(.currency(code: "USD")))
                }
            }
        }
    }
}

// ✅ Stable view identity - efficient updates
struct ProductList: View {
    let products: [Product]
    
    var body: some View {
        LazyVStack {
            ForEach(products, id: \.id) { product in
                ProductRow(product: product)
            }
        }
    }
}

struct ProductRow: View {
    let product: Product
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(product.name)
            Text(product.price.formatted(.currency(code: "USD")))
        }
    }
}
```

### Conditional View Optimization
```swift
// ❌ Creates different view types - breaks animations
struct ConditionalView: View {
    let showDetails: Bool
    
    var body: some View {
        if showDetails {
            VStack {
                Text("Title")
                Text("Details")
            }
        } else {
            Text("Title")
        }
    }
}

// ✅ Consistent view type - smooth animations
struct ConditionalView: View {
    let showDetails: Bool
    
    var body: some View {
        VStack {
            Text("Title")
            
            if showDetails {
                Text("Details")
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut, value: showDetails)
    }
}
```

## 🧪 Testing Composition Patterns

### Testable View Components
```swift
// Make views testable by extracting logic
struct ProductCard: View {
    let product: Product
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            ProductContent(product: product)
        }
    }
}

// Test the logic separately
class ProductCardTests: XCTestCase {
    func testProductDisplay() {
        let product = Product(name: "Test", price: 9.99)
        let card = ProductCard(product: product) { }
        
        // Test that the card displays correct information
        // Use ViewInspector or similar testing framework
    }
}
```

## 🎯 Best Practices Checklist

### Composition
- [ ] Views have single responsibility
- [ ] Components are reusable across contexts
- [ ] Configuration objects prevent parameter explosion
- [ ] Builder patterns handle complex optional components

### Performance
- [ ] View identity is stable across updates
- [ ] Conditional views maintain consistent types
- [ ] Heavy computations are cached or moved to view models
- [ ] Large lists use lazy loading

### Maintainability
- [ ] Views are easily testable in isolation
- [ ] Theming is consistent and environment-based
- [ ] Components follow established patterns
- [ ] Documentation explains composition decisions

---

**Next:** [State Management Architecture →](./state-management.md) - Handle complex state that scales
