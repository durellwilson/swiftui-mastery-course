# Monetization Integration

> **Build revenue-generating UI that converts users without disrupting experience**

## 💰 The Monetization Challenge

Most apps treat monetization as an afterthought - a popup that interrupts users. Successful apps integrate monetization seamlessly into the user experience, making premium features feel natural and valuable.

### Conversion Data
- **Disruptive paywalls**: 1-3% conversion rate
- **Contextual upgrades**: 8-15% conversion rate
- **Value-first approach**: 20%+ conversion rate

## 🎯 Contextual Monetization Patterns

### 1. Progressive Feature Disclosure
Reveal premium value gradually as users engage more deeply.

```swift
struct FeatureProgressionView: View {
    @StateObject private var userProgress = UserProgressTracker()
    @State private var showUpgradePrompt = false
    
    var body: some View {
        VStack(spacing: 20) {
            // Free tier features - always accessible
            BasicFeaturesSection()
            
            // Progressive premium features
            if userProgress.hasUsedBasicFeatures {
                PremiumFeaturePreview(
                    feature: .advancedEditing,
                    isUnlocked: userProgress.isPremium
                ) {
                    if userProgress.isPremium {
                        // Use feature
                        openAdvancedEditor()
                    } else {
                        // Show contextual upgrade
                        showContextualUpgrade(for: .advancedEditing)
                    }
                }
            }
            
            if userProgress.engagementLevel >= .intermediate {
                PremiumFeaturePreview(
                    feature: .cloudSync,
                    isUnlocked: userProgress.isPremium
                ) {
                    handleFeatureAccess(.cloudSync)
                }
            }
            
            if userProgress.engagementLevel >= .advanced {
                PremiumFeaturePreview(
                    feature: .aiAssistant,
                    isUnlocked: userProgress.isPremium
                ) {
                    handleFeatureAccess(.aiAssistant)
                }
            }
        }
        .sheet(isPresented: $showUpgradePrompt) {
            ContextualUpgradeView(
                feature: userProgress.lastRequestedFeature,
                userContext: userProgress.currentContext
            )
        }
    }
    
    private func showContextualUpgrade(for feature: PremiumFeature) {
        userProgress.trackFeatureRequest(feature)
        
        // Show upgrade at the right moment
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            showUpgradePrompt = true
        }
    }
}

struct PremiumFeaturePreview: View {
    let feature: PremiumFeature
    let isUnlocked: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading) {
                    HStack {
                        Text(feature.title)
                            .font(.headline)
                        
                        if !isUnlocked {
                            Image(systemName: "crown.fill")
                                .foregroundColor(.yellow)
                                .font(.caption)
                        }
                    }
                    
                    Text(feature.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.leading)
                }
                
                Spacer()
                
                if isUnlocked {
                    Image(systemName: "chevron.right")
                        .foregroundColor(.secondary)
                } else {
                    VStack {
                        Text("Premium")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color.blue)
                            .cornerRadius(4)
                    }
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isUnlocked ? Color.clear : Color.blue.opacity(0.05))
                    .stroke(isUnlocked ? Color.gray.opacity(0.3) : Color.blue.opacity(0.3), lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .disabled(!isUnlocked)
        .opacity(isUnlocked ? 1.0 : 0.8)
    }
}
```

### 2. Value-First Upgrade Prompts
Show the value before asking for payment.

```swift
struct ContextualUpgradeView: View {
    let feature: PremiumFeature
    let userContext: UserContext
    @Environment(\.dismiss) private var dismiss
    @StateObject private var purchaseManager = PurchaseManager()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Value demonstration
                    ValueDemonstrationSection(feature: feature, context: userContext)
                    
                    // Social proof
                    SocialProofSection(feature: feature)
                    
                    // Pricing (anchored high to low)
                    PricingSection()
                    
                    // Risk reduction
                    RiskReductionSection()
                }
                .padding()
            }
            .navigationTitle("Unlock \(feature.title)")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Maybe Later") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct ValueDemonstrationSection: View {
    let feature: PremiumFeature
    let context: UserContext
    
    var body: some View {
        VStack(spacing: 16) {
            // Show specific value for this user
            Text(personalizedValueMessage)
                .font(.title2)
                .fontWeight(.semibold)
                .multilineTextAlignment(.center)
            
            // Visual demonstration
            FeaturePreviewCarousel(feature: feature)
            
            // Quantified benefits
            BenefitsGrid(benefits: feature.quantifiedBenefits)
        }
    }
    
    private var personalizedValueMessage: String {
        switch feature {
        case .advancedEditing:
            return "Save 2+ hours per project with advanced editing tools"
        case .cloudSync:
            return "Never lose your \(context.projectCount) projects again"
        case .aiAssistant:
            return "Get professional results 5x faster with AI assistance"
        }
    }
}

struct BenefitsGrid: View {
    let benefits: [QuantifiedBenefit]
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 16) {
            ForEach(benefits, id: \.id) { benefit in
                VStack {
                    Text(benefit.metric)
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.blue)
                    
                    Text(benefit.description)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                }
                .padding()
                .background(Color.blue.opacity(0.1))
                .cornerRadius(12)
            }
        }
    }
}
```

### 3. Freemium Boundary Design
Make premium boundaries feel natural, not artificial.

```swift
struct FreemiumBoundaryView: View {
    let currentUsage: Int
    let limit: Int
    let feature: String
    @State private var showUpgrade = false
    
    var body: some View {
        VStack(spacing: 12) {
            // Usage indicator
            HStack {
                Text("\(feature) Usage")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text("\(currentUsage)/\(limit)")
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
            
            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                        .frame(height: 8)
                        .cornerRadius(4)
                    
                    Rectangle()
                        .fill(progressColor)
                        .frame(width: progressWidth(in: geometry), height: 8)
                        .cornerRadius(4)
                        .animation(.easeInOut, value: currentUsage)
                }
            }
            .frame(height: 8)
            
            // Contextual message
            HStack {
                Text(boundaryMessage)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if isNearLimit {
                    Button("Upgrade") {
                        showUpgrade = true
                    }
                    .font(.caption)
                    .fontWeight(.semibold)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 1)
        .sheet(isPresented: $showUpgrade) {
            UpgradeView(context: .limitReached(feature: feature))
        }
    }
    
    private var progressColor: Color {
        let percentage = Double(currentUsage) / Double(limit)
        switch percentage {
        case 0..<0.7: return .green
        case 0.7..<0.9: return .orange
        default: return .red
        }
    }
    
    private func progressWidth(in geometry: GeometryProxy) -> CGFloat {
        let percentage = min(1.0, Double(currentUsage) / Double(limit))
        return geometry.size.width * CGFloat(percentage)
    }
    
    private var isNearLimit: Bool {
        Double(currentUsage) / Double(limit) >= 0.8
    }
    
    private var boundaryMessage: String {
        let remaining = limit - currentUsage
        if remaining <= 0 {
            return "Limit reached. Upgrade to continue."
        } else if remaining <= 2 {
            return "\(remaining) remaining. Consider upgrading."
        } else {
            return "\(remaining) remaining this month."
        }
    }
}
```

## 💳 Seamless Purchase Flow

### 1. Friction-Free Purchasing
Minimize steps between intent and purchase.

```swift
struct StreamlinedPurchaseView: View {
    @StateObject private var purchaseManager = PurchaseManager()
    @State private var selectedPlan: SubscriptionPlan = .annual
    @State private var showingPurchase = false
    
    var body: some View {
        VStack(spacing: 24) {
            // Plan selection with clear value prop
            PlanSelectionView(selectedPlan: $selectedPlan)
            
            // One-tap purchase button
            PurchaseButton(plan: selectedPlan) {
                purchaseManager.purchase(selectedPlan)
            }
            .disabled(purchaseManager.isPurchasing)
            
            // Trust indicators
            TrustIndicators()
            
            // Terms (required but unobtrusive)
            TermsAndPrivacy()
        }
        .overlay {
            if purchaseManager.isPurchasing {
                PurchaseLoadingOverlay()
            }
        }
        .alert("Purchase Successful!", isPresented: $purchaseManager.showingSuccess) {
            Button("Continue") {
                // Immediately unlock features
                FeatureManager.shared.unlockPremiumFeatures()
            }
        }
    }
}

struct PurchaseButton: View {
    let plan: SubscriptionPlan
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text("Start \(plan.name)")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Text(plan.priceDescription)
                    .font(.subheadline)
                    .opacity(0.8)
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding()
            .background(
                LinearGradient(
                    colors: [Color.blue, Color.blue.opacity(0.8)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .cornerRadius(12)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}
```

### 2. Smart Pricing Display
Show pricing that maximizes perceived value.

```swift
struct SmartPricingView: View {
    let plans: [SubscriptionPlan]
    @Binding var selectedPlan: SubscriptionPlan
    
    var body: some View {
        VStack(spacing: 16) {
            ForEach(plans, id: \.id) { plan in
                PlanCard(
                    plan: plan,
                    isSelected: selectedPlan.id == plan.id,
                    isPopular: plan.isPopular
                ) {
                    selectedPlan = plan
                }
            }
        }
    }
}

struct PlanCard: View {
    let plan: SubscriptionPlan
    let isSelected: Bool
    let isPopular: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    VStack(alignment: .leading) {
                        Text(plan.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        if let savings = plan.savingsPercentage {
                            Text("Save \(savings)%")
                                .font(.caption)
                                .fontWeight(.medium)
                                .foregroundColor(.green)
                        }
                    }
                    
                    Spacer()
                    
                    if isPopular {
                        Text("Most Popular")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.orange)
                            .cornerRadius(8)
                    }
                }
                
                HStack(alignment: .bottom) {
                    Text(plan.displayPrice)
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text(plan.billingPeriod)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Spacer()
                    
                    if let monthlyEquivalent = plan.monthlyEquivalent {
                        VStack(alignment: .trailing) {
                            Text(monthlyEquivalent)
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text("per month")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color.blue.opacity(0.1) : Color(.systemBackground))
                    .stroke(
                        isSelected ? Color.blue : Color.gray.opacity(0.3),
                        lineWidth: isSelected ? 2 : 1
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}
```

## 📊 Conversion Optimization

### A/B Testing Monetization UI
```swift
struct ABTestingPaywallView: View {
    @StateObject private var abTest = PaywallABTest()
    
    var body: some View {
        Group {
            switch abTest.currentVariant {
            case .control:
                StandardPaywallView()
            case .valueFirst:
                ValueFirstPaywallView()
            case .socialProof:
                SocialProofPaywallView()
            case .urgency:
                UrgencyPaywallView()
            }
        }
        .onAppear {
            abTest.trackImpression()
        }
        .onDisappear {
            abTest.trackEngagement()
        }
    }
}

class PaywallABTest: ObservableObject {
    enum Variant: String, CaseIterable {
        case control, valueFirst, socialProof, urgency
    }
    
    @Published var currentVariant: Variant
    
    init() {
        // Assign variant based on user ID for consistency
        let userHash = UserManager.shared.currentUser.id.hashValue
        let variantIndex = abs(userHash) % Variant.allCases.count
        currentVariant = Variant.allCases[variantIndex]
    }
    
    func trackImpression() {
        Analytics.track("paywall_impression", parameters: [
            "variant": currentVariant.rawValue,
            "user_segment": UserManager.shared.currentUser.segment
        ])
    }
    
    func trackConversion() {
        Analytics.track("paywall_conversion", parameters: [
            "variant": currentVariant.rawValue,
            "user_segment": UserManager.shared.currentUser.segment
        ])
    }
}
```

## 🎯 Best Practices Checklist

### User Experience
- [ ] Monetization feels natural, not disruptive
- [ ] Value is demonstrated before asking for payment
- [ ] Premium boundaries are logical and fair
- [ ] Purchase flow has minimal friction

### Conversion Optimization
- [ ] A/B testing different approaches
- [ ] Personalized messaging based on user behavior
- [ ] Social proof and risk reduction elements
- [ ] Clear value proposition and pricing

### Technical Implementation
- [ ] Seamless feature unlocking after purchase
- [ ] Proper error handling for failed purchases
- [ ] Offline support for premium features
- [ ] Analytics tracking for optimization

### Business Metrics
- [ ] Conversion rate tracking by user segment
- [ ] Lifetime value optimization
- [ ] Churn reduction strategies
- [ ] Revenue per user monitoring

---

**Next:** [Testing Strategies →](./testing.md) - Ensure your SwiftUI code works reliably in production
