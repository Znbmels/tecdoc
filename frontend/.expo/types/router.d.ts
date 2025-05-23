/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/create`; params?: Router.UnknownInputParams; } | { pathname: `/documents`; params?: Router.UnknownInputParams; } | { pathname: `/edit`; params?: Router.UnknownInputParams; } | { pathname: `/invite`; params?: Router.UnknownInputParams; } | { pathname: `/register`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/create`; params?: Router.UnknownOutputParams; } | { pathname: `/documents`; params?: Router.UnknownOutputParams; } | { pathname: `/edit`; params?: Router.UnknownOutputParams; } | { pathname: `/invite`; params?: Router.UnknownOutputParams; } | { pathname: `/register`; params?: Router.UnknownOutputParams; } | { pathname: `/login`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/create${`?${string}` | `#${string}` | ''}` | `/documents${`?${string}` | `#${string}` | ''}` | `/edit${`?${string}` | `#${string}` | ''}` | `/invite${`?${string}` | `#${string}` | ''}` | `/register${`?${string}` | `#${string}` | ''}` | `/login${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/create`; params?: Router.UnknownInputParams; } | { pathname: `/documents`; params?: Router.UnknownInputParams; } | { pathname: `/edit`; params?: Router.UnknownInputParams; } | { pathname: `/invite`; params?: Router.UnknownInputParams; } | { pathname: `/register`; params?: Router.UnknownInputParams; } | { pathname: `/login`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
