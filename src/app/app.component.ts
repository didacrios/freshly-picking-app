import { Component } from '@angular/core';
import { OrdersService } from './orders.service';

enum Status {
  Aceptado = 2,
  Enviado = 4
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'freshly-picking-app';

  public orders: any = [];

  public filterModel;

  public columnDefs = [
    { headerName: 'ID order', field: 'id_order' },
    { headerName: 'Data de comanda', field: 'date_add', filter: 'agDateColumnFilter' },
    { headerName: 'Nom + Cognoms', field: 'customer_name' },
    { headerName: 'Adreça d\'enviament', field: 'delivery_address' },
    { headerName: 'País d\'enviament', field: 'country' },
    { headerName: 'Nom dels productes comprats', field: 'products', resizable: true },
    {
      headerName: 'Estat de la comanda',
      field: 'status',
      filter: 'agTextColumnFilter',
      valueGetter: function statusValueGetter(params) {
        return (params.data.status === Status.Aceptado ? 'Aceptado' : 'Enviado');
      }
    },
  ];

  public gridOptions = {
    deltaRowDataMode: false,
    api: undefined
  };


  constructor(private ordersServices: OrdersService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.ordersServices.getOrders().subscribe(orders => {
      this.gridOptions.api.setRowData(orders);
    });

    // Set a timer to retrieve
    // TODO: Implement socket IO

    setInterval(() => {
      this.ordersServices.getOrders().subscribe(orders => {
        this.gridOptions.api.setRowData(orders);
        this.gridOptions.api.setFilterModel(this.filterModel);
      });
    }, 5000);

  }


  public handleOnFilterChange($event) {
    // filter is changed
    this.filterModel = $event.api.getFilterModel();
    console.log(this.filterModel);
  }





}
