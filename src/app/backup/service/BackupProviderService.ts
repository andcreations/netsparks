import { Service } from '@andcreations/common';
import { BackupProvider } from '../model';

/** */
@Service()
export class BackupProviderService {
  /** */
  private readonly providers: BackupProvider[] = [];

  /** */
  registerProvider(provider: BackupProvider): void {
    this.providers.push(provider);
  }
  
  /** */
  getProviders(): BackupProvider[] {
    return [...this.providers];
  }
}