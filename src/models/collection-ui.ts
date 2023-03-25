import { FormViewSectionType } from '../types';

export interface CollectionUIGroup {
  title: string;
  description?: string;
  items?: { [key: string]: string }[];
  type?: string;
}
export interface CollectionUI {
  type: FormViewSectionType;
  default?: boolean;
  title?: string;
  collapsible?: boolean;
  popup?: 'none' | 'auto' | 'top' | 'right' | 'bottom' | 'left';
  items?: { [key: string]: string }[];
  accordion?: CollectionUIGroup[];
  slider?: CollectionUIGroup[];
  tab?: CollectionUIGroup[];
  buttons?: {
    back?: { title: string; handler: () => {} };
    next?: { title: string; handler: () => {} };
    skip?: { title: string; handler: () => {} };
    finish?: { title: string; handler: () => {} };
  };
  rules?: {};
}