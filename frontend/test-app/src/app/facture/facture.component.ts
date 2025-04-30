import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { ProductService } from '../services/product.service';
import { InvoiceService } from '../services/invoice.service';
import jsPDF from 'jspdf';

interface InvoiceItem {
  produit: any;
  quantite: number;
}

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  currentDate: Date = new Date();
  clients: any[] = [];
  products: any[] = [];
  selectedClient: any = null;
  invoiceItems: InvoiceItem[] = [];
  totalHT: number = 0;
  totalTTC: number = 0;
  
  // Currency code
  currencyCode: string = 'MAD';

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
    this.addItem(); // Add empty first row
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  addItem(): void {
    this.invoiceItems.push({
      produit: null,
      quantite: 1
    });
  }

  removeItem(index: number): void {
    if (this.invoiceItems.length > 1) {
      this.invoiceItems.splice(index, 1);
      this.calculateTotals();
    }
  }
  
  // Check if product is already in the invoice
  isProductAlreadyAdded(product: any): boolean {
    if (!product) return false;
    
    return this.invoiceItems.some(
      item => item.produit && item.produit._id === product._id
    );
  }
  
  // Method to handle product selection
  onProductSelected(index: number, product: any): void {
    // If the product is already selected in another row, prevent selection
    const isAlreadySelected = this.invoiceItems.some(
      (item, i) => i !== index && item.produit && item.produit._id === product._id
    );
    
    if (isAlreadySelected) {
      alert('Ce produit est déjà ajouté à la facture.');
      this.invoiceItems[index].produit = null;
      return;
    }
    
    this.calculateTotals();
  }

  getLineTotal(item: InvoiceItem): number {
    if (item.produit && item.quantite) {
      return item.produit.PU * item.quantite;
    }
    return 0;
  }

  calculateTotals(): void {
    this.totalHT = this.invoiceItems.reduce((sum, item) => {
      return sum + this.getLineTotal(item);
    }, 0);
    
    this.totalTTC = this.totalHT * 1.20; // Adding 20% VAT
  }

  isValidInvoice(): boolean {
    if (!this.selectedClient) return false;
    
    // Check if at least one item has a product and quantity
    return this.invoiceItems.some(item => 
      item.produit !== null && item.quantite > 0
    );
  }

  saveInvoice(): void {
    if (!this.isValidInvoice()) return;

    // Only include valid items (with product and quantity)
    const validItems = this.invoiceItems.filter(
      item => item.produit !== null && item.quantite > 0
    );

    const invoice = {
      client: this.selectedClient._id,
      lignesCommande: validItems.map(item => ({
        produit: item.produit._id,
        quantite: item.quantite
      }))
    };

    this.invoiceService.createInvoice(invoice).subscribe(
      (response) => {
        alert('Facture enregistrée avec succès!');
        // Reset form or redirect
      },
      (error) => {
        console.error('Error saving invoice:', error);
        alert('Erreur lors de l\'enregistrement de la facture');
      }
    );
  }

  downloadPdf(): void {
    if (!this.isValidInvoice()) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${this.currentDate.toLocaleDateString()}`, 20, 30);
    
    // Client info
    doc.text(`Client: ${this.selectedClient.nom}`, 20, 40);
    
    // Table headers
    doc.setFontSize(11);
    doc.text('Produit', 20, 60);
    doc.text('Quantité', 80, 60);
    doc.text('Prix unitaire', 120, 60);
    doc.text('Total', 170, 60);
    
    doc.line(20, 65, 190, 65); // Horizontal line below headers
    
    // Table content
    let y = 75;
    const validItems = this.invoiceItems.filter(
      item => item.produit !== null && item.quantite > 0
    );
    
    validItems.forEach(item => {
      doc.setFontSize(10);
      doc.text(item.produit.libelle, 20, y);
      doc.text(item.quantite.toString(), 80, y);
      doc.text(`${item.produit.PU.toFixed(2)} ${this.currencyCode}`, 120, y);
      doc.text(`${this.getLineTotal(item).toFixed(2)} ${this.currencyCode}`, 170, y);
      y += 10;
    });
    
    // Totals
    doc.line(20, y+5, 190, y+5); // Horizontal line above totals
    y += 15;
    
    doc.setFontSize(11);
    doc.text('Total HT:', 140, y);
    doc.text(`${this.totalHT.toFixed(2)} ${this.currencyCode}`, 170, y);
    
    y += 10;
    doc.text('TVA (20%):', 140, y);
    doc.text(`${(this.totalTTC - this.totalHT).toFixed(2)} ${this.currencyCode}`, 170, y);
    
    y += 10;
    doc.setFontSize(12);
    doc.text('Total TTC:', 140, y);
    doc.text(`${this.totalTTC.toFixed(2)} ${this.currencyCode}`, 170, y);
    
    // Save the PDF
    const filename = `Facture_${this.selectedClient.nom}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  }
}
