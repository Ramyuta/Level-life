type ErrorContext = Record<string, any>;

class ErrorService {
  private static instance: ErrorService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  public init() {
    if (this.isInitialized) return;
    // Initialize Sentry or other providers here
    console.log("[ErrorService] Initialized");
    this.isInitialized = true;
  }

  public captureException(error: any, context?: ErrorContext) {
    if (process.env.NODE_ENV === "development") {
      console.group("[ErrorService] Exception Captured");
      console.error(error);
      if (context) console.log("Context:", context);
      console.groupEnd();
    } else {
      // Send to Sentry
      // Sentry.captureException(error, { extra: context });
    }
  }

  public captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info"
  ) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[ErrorService] [${level.toUpperCase()}] ${message}`);
    } else {
      // Send to Sentry
      // Sentry.captureMessage(message, level);
    }
  }
}

export const errorService = ErrorService.getInstance();
