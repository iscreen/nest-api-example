import { AuthGuard } from '@nestjs/passport';

export class JwtGuart extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
