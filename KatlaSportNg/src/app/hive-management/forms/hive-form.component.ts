import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveService } from '../services/hive.service';
import { Hive } from '../models/hive';

@Component({
  selector: 'app-hive-form',
  templateUrl: './hive-form.component.html',
  styleUrls: ['./hive-form.component.css']
})
export class HiveFormComponent implements OnInit {

  hive = new Hive(0, "", "", "", false, "");
  existed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveService: HiveService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['id'] === undefined) return;
      this.hiveService.getHive(p['id']).subscribe(h => this.hive = h);
      this.existed = true;
    });
  }

  navigateToHives() {
    this.router.navigate(['/hives']);
  }

  onCancel() {
    this.navigateToHives();
  }
  
  onSubmit(hiveId: number) {
    if(this.existed){
      return this.hiveService.updateHive(hiveId, this.hive).subscribe(()=>this.navigateToHives());
    }
    else{
      return this.hiveService.addHive(this.hive).subscribe(()=>this.navigateToHives());
    }
  }

  onDelete(hiveId: number) {
    this.hiveService.setHiveStatus(hiveId, true).subscribe(_ => this.hive.isDeleted = true);
  }

  onRestore(hiveId: number) {
    this.hiveService.setHiveStatus(hiveId, false).subscribe(_ => this.hive.isDeleted = false);
  }

  onPurge(hiveId: number) {
    this.hiveService.deleteHive(hiveId).subscribe(()=>this.navigateToHives());
  }
}
