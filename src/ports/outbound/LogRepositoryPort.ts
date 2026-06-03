import { RequestLogEntry, SystemMetrics, FailoverRule } from "../../domain/types";

export interface LogRepositoryPort {
  save(entry: RequestLogEntry): Promise<void>;
  getAll(limit?: number): Promise<RequestLogEntry[]>;
  getMetrics(): Promise<SystemMetrics>;
  clearLogs(): Promise<void>;
  
  // Failover policy management integrated directly here or can be a separate port. Let's place it in logs port for extreme modular elegance
  getFailoverRules(): Promise<FailoverRule[]>;
  updateFailoverRule(rule: FailoverRule): Promise<void>;
}
