declare module '@appuniversum/ember-appuniversum' {
    // Define a basic interface for what the Toaster Service provides
    export interface ToasterService {
        success(title: string, message?: string, options?: Record<string, unknown>): void;
        warning(title: string, message?: string, options?: Record<string, unknown>): void;
        error(title: string, message?: string, options?: Record<string, unknown>): void;
        info(title: string, message?: string, options?: Record<string, unknown>): void;
        clear?(): void;
    }
}