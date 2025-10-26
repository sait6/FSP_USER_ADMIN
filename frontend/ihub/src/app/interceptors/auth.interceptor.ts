import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token: string | null = null;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token');
    }

    console.log('Intercepting request to:', req.url);
    console.log('Token present:', !!token);

    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    this.loader.show();

    return next.handle(authReq).pipe(finalize(() => this.loader.hide()));
  }
}
