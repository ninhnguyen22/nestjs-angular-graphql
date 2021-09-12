import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatToolbarModule,
  MatMenuModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatTabsModule,
  MatFormFieldModule,
  MatRippleModule,
} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule,
  ]
})
export class MaterialModule {
}
