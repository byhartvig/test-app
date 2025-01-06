const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor() {
    this.environment = process.env.NODE_ENV || "development";
    this.minLevel =
      this.environment === "production" ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
    this.supabase = null;
  }

  async _initSupabase() {
    if (!this.supabase) {
      const { createClient } = await import("@/utils/supabase/client");
      this.supabase = createClient();
    }
    return this.supabase;
  }

  _shouldLog(level) {
    return level >= this.minLevel;
  }

  _formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      environment: this.environment,
      message,
      ...data,
    };
  }

  async _persistLog(logEntry) {
    const {
      timestamp,
      level,
      message,
      environment,
      category = "info",
      userId,
      method,
      path,
      statusCode,
      duration,
      stack,
      metric,
      value,
      ...rest
    } = logEntry;

    // Format the data for Supabase
    const data = {
      timestamp: new Date(timestamp),
      level: level.toUpperCase(),
      category: category.toLowerCase(),
      message,
      environment,
      user_id: userId,
      method,
      path,
      status_code: statusCode,
      duration_ms: duration,
      error_stack: stack,
      metric_name: metric,
      metric_value: value,
      metadata: rest,
    };

    // Always log to console in development
    console.log(
      `[Logger] Attempting to persist log:`,
      JSON.stringify(data, null, 2)
    );

    try {
      const supabase = await this._initSupabase();
      console.log("[Logger] Supabase client created, inserting log...");

      const { data: result, error } = await supabase
        .from("logs")
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error("[Logger] Error inserting log:", error);
        throw error;
      }

      console.log("[Logger] Log inserted successfully:", result);
    } catch (error) {
      console.error("[Logger] Error in _persistLog:", error);
      // Still log to console as fallback
      const { timestamp, level, message, ...rest } = logEntry;
      console.log(
        `${timestamp} [${level}] ${message}`,
        Object.keys(rest).length ? rest : ""
      );
    }
  }

  // User events
  async logUserAction(action, userId, metadata = {}) {
    const logEntry = this._formatMessage("INFO", `User Action: ${action}`, {
      userId,
      action,
      category: "user_action",
      ...metadata,
    });
    await this._persistLog(logEntry);
  }

  // Auth events
  async logAuth(event, userId, metadata = {}) {
    const logEntry = this._formatMessage("INFO", `Auth Event: ${event}`, {
      userId,
      event,
      category: "auth",
      ...metadata,
    });
    await this._persistLog(logEntry);
  }

  // API events
  async logAPI(method, path, statusCode, duration, metadata = {}) {
    const logEntry = this._formatMessage("INFO", `API ${method} ${path}`, {
      method,
      path,
      statusCode,
      duration,
      category: "api",
      ...metadata,
    });
    await this._persistLog(logEntry);
  }

  // Error events
  async logError(error, metadata = {}) {
    const logEntry = this._formatMessage("ERROR", error.message, {
      stack: error.stack,
      category: "error",
      ...metadata,
    });
    await this._persistLog(logEntry);
  }

  // Performance events
  async logPerformance(metric, value, metadata = {}) {
    const logEntry = this._formatMessage("INFO", `Performance: ${metric}`, {
      metric,
      value,
      category: "performance",
      ...metadata,
    });
    await this._persistLog(logEntry);
  }

  // Generic debug logs
  async debug(message, metadata = {}) {
    if (!this._shouldLog(LOG_LEVELS.DEBUG)) return;
    const logEntry = this._formatMessage("DEBUG", message, metadata);
    await this._persistLog(logEntry);
  }

  async info(message, metadata = {}) {
    if (!this._shouldLog(LOG_LEVELS.INFO)) return;
    const logEntry = this._formatMessage("INFO", message, metadata);
    await this._persistLog(logEntry);
  }

  async warn(message, metadata = {}) {
    if (!this._shouldLog(LOG_LEVELS.WARN)) return;
    const logEntry = this._formatMessage("WARN", message, metadata);
    await this._persistLog(logEntry);
  }

  async error(message, metadata = {}) {
    if (!this._shouldLog(LOG_LEVELS.ERROR)) return;
    const logEntry = this._formatMessage("ERROR", message, metadata);
    await this._persistLog(logEntry);
  }
}

export const logger = new Logger();
