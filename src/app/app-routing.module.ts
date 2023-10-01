import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuarioCreateComponent } from './components/usuario-list/usuario-create/usuario-create.component';
import { UsuarioUpdateComponent } from './components/usuario-list/usuario-update/usuario-update.component';
import { RolListComponent } from './components/rol-list/rol-list.component';
import { RolUpdateComponent } from './components/rol-list/rol-update/rol-update.component';
import { RolCreateComponent } from './components/rol-list/rol-create/rol-create.component';
import { ModuloListComponent } from './components/modulo-list/modulo-list.component';
import { ModuloUpdateComponent } from './components/modulo-list/modulo-update/modulo-update.component';
import { ModuloCreateComponent } from './components/modulo-list/modulo-create/modulo-create.component';
import { TipoProgramaListComponent } from './components/tipo-programa-list/tipo-programa-list.component';
import { TipoProgramaUpdateComponent } from './components/tipo-programa-list/tipo-programa-update/tipo-programa-update.component';
import { TipoProgramaCreateComponent } from './components/tipo-programa-list/tipo-programa-create/tipo-programa-create.component';
import { DepositoListComponent } from './components/deposito-list/deposito-list.component';
import { DepositoUpdateComponent } from './components/deposito-list/deposito-update/deposito-update.component';
import { DepositoCreateComponent } from './components/deposito-list/deposito-create/deposito-create.component';
import { ImpuestoListComponent } from './components/impuesto-list/impuesto-list.component';
import { ImpuestoUpdateComponent } from './components/impuesto-list/impuesto-update/impuesto-update.component';
import { ImpuestoCreateComponent } from './components/impuesto-list/impuesto-create/impuesto-create.component';
import { MarcaListComponent } from './components/marca-list/marca-list.component';
import { MarcaUpdateComponent } from './components/marca-list/marca-update/marca-update.component';
import { MarcaCreateComponent } from './components/marca-list/marca-create/marca-create.component';
import { UnidadMedidaListComponent } from './components/unidad-medida-list/unidad-medida-list.component';
import { UnidadMedidaUpdateComponent } from './components/unidad-medida-list/unidad-medida-update/unidad-medida-update.component';
import { UnidadMedidaCreateComponent } from './components/unidad-medida-list/unidad-medida-create/unidad-medida-create.component';
import { ArticuloListComponent } from './components/articulo-list/articulo-list.component';
import { ArticuloUpdateComponent } from './components/articulo-list/articulo-update/articulo-update.component';
import { ArticuloCreateComponent } from './components/articulo-list/articulo-create/articulo-create.component';
import { HomeComponent } from './components/home/home.component';
import { MonedaListComponent } from './components/moneda-list/moneda-list.component';
import { MonedaUpdateComponent } from './components/moneda-list/moneda-update/moneda-update.component';
import { MonedaCreateComponent } from './components/moneda-list/moneda-create/moneda-create.component';
import { ListaPrecioListComponent } from './components/lista-precio-list/lista-precio-list.component';
import { ListaPrecioUpdateComponent } from './components/lista-precio-list/lista-precio-update/lista-precio-update.component';
import { ListaPrecioCreateComponent } from './components/lista-precio-list/lista-precio-create/lista-precio-create.component';
import { ArticuloPrecioComponent } from './components/articulo-list/articulo-precio/articulo-precio.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { ClienteUpdateComponent } from './components/cliente-list/cliente-update/cliente-update.component';
import { ClienteCreateComponent } from './components/cliente-list/cliente-create/cliente-create.component';
import { PedidoVentaComponent } from './components/pedido-venta/pedido-venta.component';
import { CaidaTicketComponent } from './components/pedido-venta/caida-ticket/caida-ticket.component';
import { CajaListComponent } from './components/caja-list/caja-list.component';
import { CajaUpdateComponent } from './components/caja-list/caja-update/caja-update.component';
import { CajaCreateComponent } from './components/caja-list/caja-create/caja-create.component';
import { TipoDocumentoListComponent } from './components/tipo-documento-list/tipo-documento-list.component';
import { TipoDocumentoUpdateComponent } from './components/tipo-documento-list/tipo-documento-update/tipo-documento-update.component';
import { TipoDocumentoCreateComponent } from './components/tipo-documento-list/tipo-documento-create/tipo-documento-create.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [

      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

      { path: 'usuario', component: UsuarioListComponent, canActivate: [AuthGuard] },
      { path: 'usuario_editar/:id', component: UsuarioUpdateComponent, canActivate: [AuthGuard] },
      { path: 'usuario_nuevo', component: UsuarioCreateComponent, canActivate: [AuthGuard] },

      { path: 'rol', component: RolListComponent, canActivate: [AuthGuard] },
      { path: 'rol_editar/:id', component: RolUpdateComponent, canActivate: [AuthGuard] },
      { path: 'rol_nuevo', component: RolCreateComponent, canActivate: [AuthGuard] },

      { path: 'modulo', component: ModuloListComponent, canActivate: [AuthGuard] },
      { path: 'modulo_editar/:id', component: ModuloUpdateComponent, canActivate: [AuthGuard] },
      { path: 'modulo_nuevo', component: ModuloCreateComponent, canActivate: [AuthGuard] },

      { path: 'tipo_programa', component: TipoProgramaListComponent, canActivate: [AuthGuard] },
      { path: 'tipo_programa_editar/:id', component: TipoProgramaUpdateComponent, canActivate: [AuthGuard] },
      { path: 'tipo_programa_nuevo', component: TipoProgramaCreateComponent, canActivate: [AuthGuard] },

      { path: 'deposito', component: DepositoListComponent, canActivate: [AuthGuard] },
      { path: 'deposito_editar/:id', component: DepositoUpdateComponent, canActivate: [AuthGuard] },
      { path: 'deposito_nuevo', component: DepositoCreateComponent, canActivate: [AuthGuard] },

      { path: 'impuesto', component: ImpuestoListComponent, canActivate: [AuthGuard] },
      { path: 'impuesto_editar/:id', component: ImpuestoUpdateComponent, canActivate: [AuthGuard] },
      { path: 'impuesto_nuevo', component: ImpuestoCreateComponent, canActivate: [AuthGuard] },

      { path: 'marca', component: MarcaListComponent, canActivate: [AuthGuard] },
      { path: 'marca_editar/:id', component: MarcaUpdateComponent, canActivate: [AuthGuard] },
      { path: 'marca_nuevo', component: MarcaCreateComponent, canActivate: [AuthGuard] },

      { path: 'unidad_medida', component: UnidadMedidaListComponent, canActivate: [AuthGuard] },
      { path: 'unidad_medida_editar/:id', component: UnidadMedidaUpdateComponent, canActivate: [AuthGuard] },
      { path: 'unidad_medida_nuevo', component: UnidadMedidaCreateComponent, canActivate: [AuthGuard] },

      { path: 'articulo', component: ArticuloListComponent, canActivate: [AuthGuard] },
      { path: 'articulo_editar/:id', component: ArticuloUpdateComponent, canActivate: [AuthGuard] },
      { path: 'articulo_nuevo', component: ArticuloCreateComponent, canActivate: [AuthGuard] },
      { path: 'articulo_precio/:id', component: ArticuloPrecioComponent, canActivate: [AuthGuard] },

      { path: 'moneda', component: MonedaListComponent, canActivate: [AuthGuard] },
      { path: 'moneda_editar/:id', component: MonedaUpdateComponent, canActivate: [AuthGuard] },
      { path: 'moneda_nuevo', component: MonedaCreateComponent, canActivate: [AuthGuard] },

      { path: 'lista_precio', component: ListaPrecioListComponent, canActivate: [AuthGuard] },
      { path: 'lista_precio_editar/:id', component: ListaPrecioUpdateComponent, canActivate: [AuthGuard] },
      { path: 'lista_precio_nuevo', component: ListaPrecioCreateComponent, canActivate: [AuthGuard] },

      { path: 'cliente', component: ClienteListComponent, canActivate: [AuthGuard] },
      { path: 'cliente_editar/:id', component: ClienteUpdateComponent, canActivate: [AuthGuard] },
      { path: 'cliente_nuevo', component: ClienteCreateComponent, canActivate: [AuthGuard] },

      { path: 'pedido_venta', component: PedidoVentaComponent, canActivate: [AuthGuard] },

      { path: 'caja', component: CajaListComponent, canActivate: [AuthGuard] },
      { path: 'caja_editar/:id', component: CajaUpdateComponent, canActivate: [AuthGuard] },
      { path: 'caja_nuevo', component: CajaCreateComponent, canActivate: [AuthGuard] },

      { path: 'tipo_documento', component: TipoDocumentoListComponent, canActivate: [AuthGuard] },
      { path: 'tipo_documento_editar/:id', component: TipoDocumentoUpdateComponent, canActivate: [AuthGuard] },
      { path: 'tipo_documento_nuevo', component: TipoDocumentoCreateComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: 'pedido_venta_comprobante/:id', component: CaidaTicketComponent, canActivate: [AuthGuard] },
  // Redirección de la ruta por defecto al componente de login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
