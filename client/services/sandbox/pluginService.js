export class PluginService {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }

  registerPlugin(plugin) {
    try {
      if (!this.validatePlugin(plugin)) {
        throw new Error('Invalid plugin format');
      }

      this.plugins.set(plugin.id, {
        ...plugin,
        enabled: true,
        status: 'active'
      });

      // Register plugin hooks
      plugin.hooks?.forEach(hook => {
        if (!this.hooks.has(hook.type)) {
          this.hooks.set(hook.type, new Set());
        }
        this.hooks.get(hook.type).add(hook.handler);
      });

      return true;
    } catch (error) {
      console.error('Plugin registration error:', error);
      throw error;
    }
  }

  validatePlugin(plugin) {
    return (
      plugin.id &&
      plugin.name &&
      plugin.version &&
      typeof plugin.initialize === 'function'
    );
  }

  async executeHook(type, data) {
    if (!this.hooks.has(type)) return data;

    let result = data;
    for (const handler of this.hooks.get(type)) {
      result = await handler(result);
    }
    return result;
  }

  getPlugins() {
    return Array.from(this.plugins.values());
  }

  getPlugin(id) {
    return this.plugins.get(id);
  }

  togglePlugin(id, enabled) {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.enabled = enabled;
      this.plugins.set(id, plugin);
    }
  }
} 