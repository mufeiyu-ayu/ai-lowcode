import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'

import { ApiResult } from '../../../common/decorators/api-result.decorator'

import { ApiSecurityAuth } from '../../../common/decorators/swagger.decorator'

import type { PasswordUpdateDto } from '../../user/dto/password.dto'

import { AccountInfo } from '../../user/user.model'
import type { UserService } from '../../user/user.service'
import type { AuthService } from '../auth.service'
import { AllowAnon } from '../decorators/allow-anon.decorator'
import { AuthUser } from '../decorators/auth-user.decorator'
import type { AccountUpdateDto } from '../dto/account.dto'
import { AccountMenus } from '../dto/account.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@ApiTags('Account - 账户模块')
@ApiSecurityAuth()
@ApiExtraModels(AccountInfo)
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: '获取账户资料' })
  @ApiResult({ type: AccountInfo })
  @AllowAnon()
  async profile(@AuthUser() user: IAuthUser): Promise<AccountInfo> {
    return this.userService.getAccountInfo(user.uid)
  }

  @Get('logout')
  @ApiOperation({ summary: '账户登出' })
  @AllowAnon()
  async logout(@AuthUser() user: IAuthUser, @Req() req: FastifyRequest): Promise<void> {
    await this.authService.clearLoginStatus(user, req.accessToken)
  }

  @Get('menus')
  @ApiOperation({ summary: '获取菜单列表' })
  @ApiResult({ type: [AccountMenus] })
  @AllowAnon()
  async menu(@AuthUser() user: IAuthUser) {
    return this.authService.getMenus(user.uid)
  }

  @Get('permissions')
  @ApiOperation({ summary: '获取权限列表' })
  @ApiResult({ type: [String] })
  @AllowAnon()
  async permissions(@AuthUser() user: IAuthUser): Promise<string[]> {
    return this.authService.getPermissions(user.uid)
  }

  @Put('update')
  @ApiOperation({ summary: '更改账户资料' })
  @AllowAnon()
  async update(
    @AuthUser() user: IAuthUser, @Body()
dto: AccountUpdateDto,
  ): Promise<void> {
    await this.userService.updateAccountInfo(user.uid, dto)
  }

  @Post('password')
  @ApiOperation({ summary: '更改账户密码' })
  @AllowAnon()
  async password(
    @AuthUser() user: IAuthUser, @Body()
dto: PasswordUpdateDto,
  ): Promise<void> {
    await this.userService.updatePassword(user.uid, dto)
  }
}
