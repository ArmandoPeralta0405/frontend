import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { NgxBarcode6Module } from 'ngx-barcode6'; // Importa el módulo ngx-barcode6


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Importa el interceptor
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsuarioCreateComponent } from './components/usuario-list/usuario-create/usuario-create.component';
import { UsuarioUpdateComponent } from './components/usuario-list/usuario-update/usuario-update.component';
import { RolListComponent } from './components/rol-list/rol-list.component';
import { RolCreateComponent } from './components/rol-list/rol-create/rol-create.component';
import { RolUpdateComponent } from './components/rol-list/rol-update/rol-update.component';
import { ModuloListComponent } from './components/modulo-list/modulo-list.component';
import { ModuloCreateComponent } from './components/modulo-list/modulo-create/modulo-create.component';
import { ModuloUpdateComponent } from './components/modulo-list/modulo-update/modulo-update.component';
import { TipoProgramaListComponent } from './components/tipo-programa-list/tipo-programa-list.component';
import { TipoProgramaCreateComponent } from './components/tipo-programa-list/tipo-programa-create/tipo-programa-create.component';
import { TipoProgramaUpdateComponent } from './components/tipo-programa-list/tipo-programa-update/tipo-programa-update.component';
import { DepositoListComponent } from './components/deposito-list/deposito-list.component';
import { DepositoCreateComponent } from './components/deposito-list/deposito-create/deposito-create.component';
import { DepositoUpdateComponent } from './components/deposito-list/deposito-update/deposito-update.component';
import { ImpuestoListComponent } from './components/impuesto-list/impuesto-list.component';
import { ImpuestoCreateComponent } from './components/impuesto-list/impuesto-create/impuesto-create.component';
import { ImpuestoUpdateComponent } from './components/impuesto-list/impuesto-update/impuesto-update.component';
import { MarcaListComponent } from './components/marca-list/marca-list.component';
import { MarcaCreateComponent } from './components/marca-list/marca-create/marca-create.component';
import { MarcaUpdateComponent } from './components/marca-list/marca-update/marca-update.component';
import { UnidadMedidaListComponent } from './components/unidad-medida-list/unidad-medida-list.component';
import { UnidadMedidaCreateComponent } from './components/unidad-medida-list/unidad-medida-create/unidad-medida-create.component';
import { UnidadMedidaUpdateComponent } from './components/unidad-medida-list/unidad-medida-update/unidad-medida-update.component';
import { ArticuloListComponent } from './components/articulo-list/articulo-list.component';
import { ArticuloCreateComponent } from './components/articulo-list/articulo-create/articulo-create.component';
import { ArticuloUpdateComponent } from './components/articulo-list/articulo-update/articulo-update.component';
import { HomeComponent } from './components/home/home.component';
import { MonedaListComponent } from './components/moneda-list/moneda-list.component';
import { MonedaUpdateComponent } from './components/moneda-list/moneda-update/moneda-update.component';
import { MonedaCreateComponent } from './components/moneda-list/moneda-create/moneda-create.component';
import { ListaPrecioListComponent } from './components/lista-precio-list/lista-precio-list.component';
import { ListaPrecioCreateComponent } from './components/lista-precio-list/lista-precio-create/lista-precio-create.component';
import { ListaPrecioUpdateComponent } from './components/lista-precio-list/lista-precio-update/lista-precio-update.component';
import { FocusService } from './global/focus.service';
import { ArticuloPrecioComponent } from './components/articulo-list/articulo-precio/articulo-precio.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { ClienteUpdateComponent } from './components/cliente-list/cliente-update/cliente-update.component';
import { ClienteCreateComponent } from './components/cliente-list/cliente-create/cliente-create.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    UsuarioListComponent,
    UsuarioCreateComponent,
    UsuarioUpdateComponent,
    RolListComponent,
    RolCreateComponent,
    RolUpdateComponent,
    ModuloListComponent,
    ModuloCreateComponent,
    ModuloUpdateComponent,
    TipoProgramaListComponent,
    TipoProgramaCreateComponent,
    TipoProgramaUpdateComponent,
    DepositoListComponent,
    DepositoCreateComponent,
    DepositoUpdateComponent,
    ImpuestoListComponent,
    ImpuestoCreateComponent,
    ImpuestoUpdateComponent,
    MarcaListComponent,
    MarcaCreateComponent,
    MarcaUpdateComponent,
    UnidadMedidaListComponent,
    UnidadMedidaCreateComponent,
    UnidadMedidaUpdateComponent,
    ArticuloListComponent,
    ArticuloCreateComponent,
    ArticuloUpdateComponent,
    HomeComponent,
    MonedaListComponent,
    MonedaUpdateComponent,
    MonedaCreateComponent,
    ListaPrecioListComponent,
    ListaPrecioCreateComponent,
    ListaPrecioUpdateComponent,
    ArticuloPrecioComponent,
    ClienteListComponent,
    ClienteUpdateComponent,
    ClienteCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxBarcode6Module
  ],
  providers: [
    // ... otros proveedores
    FocusService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideEnvironmentNgxMask(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
