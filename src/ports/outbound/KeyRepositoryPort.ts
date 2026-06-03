import { RouteLMApiKey } from "../../domain/types";

export interface KeyRepositoryPort {
  createKey(name: string): Promise<RouteLMApiKey>;
  validateKey(key: string): Promise<boolean>;
  incrementKeyUsage(key: string): Promise<void>;
  getAllKeys(): Promise<RouteLMApiKey[]>;
  revokeKey(id: string): Promise<void>;
}
