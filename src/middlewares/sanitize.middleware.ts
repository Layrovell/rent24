import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  private readonly unsafePattern =
    /(javascript:|data:|vbscript:|file:|about:|view-source:)/i; // Pattern to match unsafe content
  private readonly htmlTagPattern = /<\/?[^>]+(>|$)/; // Pattern to match any HTML tags

  use(req: any, res: any, next: () => void) {
    // req.body = this.sanitizeRequestBody(req.body);

    // Sanitize and check each field in the request body for unsafe content
    const isSafe = this.checkAndSanitize(req.body);

    if (!isSafe) {
      throw new BadRequestException('Input contains unsafe HTML content');
    }

    // Sanitize and check query parameters for unsafe content
    const isQuerySafe = this.checkAndSanitize(req.query);

    if (!isQuerySafe) {
      throw new BadRequestException(
        'Input contains unsafe HTML content in query parameters'
      );
    }

    next();
  }

  // To completely remove harmful content and set data to database:
  private _sanitizeRequestBody(body: any): any {
    if (typeof body === 'string') {
      return sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} });
    }

    if (body && typeof body === 'object') {
      for (const key in body) {
        body[key] = this._sanitizeRequestBody(body[key]);
      }
    }

    return body;
  }

  private _checkRequestBody(body: any): boolean {
    if (typeof body === 'string') {
      // Check if sanitization modifies the content; if it does, it's unsafe
      return (
        body === sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} })
      );
    }

    if (body && typeof body === 'object') {
      for (const key in body) {
        if (!this._checkRequestBody(body[key])) {
          return false;
        }
      }
    }

    return true;
  }

  private checkAndSanitize(data: any): boolean {
    if (typeof data === 'string') {
      if (this.unsafePattern.test(data) || this.htmlTagPattern.test(data)) {
        return false; // Unsafe content detected
      }

      // Sanitize HTML content
      const sanitizedData = sanitizeHtml(data, {
        allowedTags: [],
        allowedAttributes: {},
      });

      return data === sanitizedData; // Compare with sanitized data
    }

    if (data && typeof data === 'object') {
      for (const key in data) {
        if (!this.checkAndSanitize(data[key])) {
          return false;
        }
      }
    }

    return true;
  }
}

// XSS Scenarios:
// input=javascript:alert(document.cookie)
// input=<script>alert('XSS')</script>
// <img src="invalid" onerror="alert('XSS')">, <script>alert(document.cookie)</script>
