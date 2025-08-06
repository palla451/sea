export abstract class GenericModal<T = any> {
  data?: T;

  abstract get translationModalName(): string;
  abstract get translationParams(): Record<string, any>;

  abstract onSave(): void;
  abstract onClose(): void;
}
