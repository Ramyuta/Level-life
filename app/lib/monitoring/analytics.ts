type EventProperties = Record<string, any>;

class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public init() {
    if (this.isInitialized) return;
    // Initialize Mixpanel or other providers here
    console.log("[AnalyticsService] Initialized");
    this.isInitialized = true;
  }

  public identify(userId: string, traits?: EventProperties) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[AnalyticsService] Identify: ${userId}`, traits);
    } else {
      // Mixpanel.identify(userId);
      // if (traits) Mixpanel.people.set(traits);
    }
  }

  public track(eventName: string, properties?: EventProperties) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[AnalyticsService] Track: ${eventName}`, properties);
    } else {
      // Mixpanel.track(eventName, properties);
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
