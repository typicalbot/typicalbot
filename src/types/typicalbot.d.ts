export interface CommandOptions {
  description?: string;
  usage?: string;
  aliases?: string[];
  dm?: boolean;
  permission?: number;
  mode?: number;
  access?: number;
}
