export class BackupService {
  constructor() {
    this.storageKey = 'nft_marketplace_backup';
  }

  async createBackup(data) {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        data: data,
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nft-marketplace-backup-${backup.timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async restoreFromFile(file) {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const backup = JSON.parse(event.target.result);
            if (!this.validateBackup(backup)) {
              throw new Error('Invalid backup file');
            }
            resolve(backup.data);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  validateBackup(backup) {
    return (
      backup &&
      backup.timestamp &&
      backup.data &&
      backup.version &&
      typeof backup.data === 'object'
    );
  }
} 