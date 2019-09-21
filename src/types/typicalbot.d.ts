export interface CommandOptions {
  description?: string;
  usage?: string;
  aliases?: string[];
  dm?: boolean;
  permission?: -1 | 0 | 1 | 2 | 3 | 4 | 10;
  mode?: 0 | 1 | 2;
  access?: 0 | 1 | 3;
}
