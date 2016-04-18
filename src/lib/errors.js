export class NotAuthorizedException {
  constructor(to = '/login') {
    this.redirectTo = to;
  }
}

export class AccessDeniedException {
  constructor(to = '/403') {
    this.redirectTo = to;
  }
}

export class RedirectException {
  constructor(to = '/dashboard') {
    this.redirectTo = to;
  }
}
