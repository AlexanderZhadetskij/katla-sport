import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveSectionService } from '../services/hive-section.service';
import { HiveSection } from '../models/hive-section';
import {Location} from '@angular/common';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})

export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "", "", false, "", 0);
  existed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['id'] === undefined){
        this.hiveSection.storeHiveId = p['hiveId'];
        return;
      }
      this.hiveSectionService.getHiveSection(p['id']).subscribe(h => {
        this.hiveSection = h;
        this.hiveSection.storeHiveId = p['hiveId'];
      });
      this.existed = true;
    });
  }

  navigateToHiveSections() {
    this.router.navigate([`/hive/${this.hiveSection.storeHiveId}/sections`]);
  }

  onCancel(){
    this.navigateToHiveSections();
  }

  onSubmit() {
    if (this.existed)
    {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(c => this.navigateToHiveSections());
    }
    else
    {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(c => this.navigateToHiveSections());
    }
  }

  onDelete(hiveSectionId: number) {
    this.hiveSectionService.setHiveSectionStatus(hiveSectionId, true).subscribe(_ => this.hiveSection.isDeleted = true);
  }

  onRestore(hiveSectionId: number) {
    this.hiveSectionService.setHiveSectionStatus(hiveSectionId, false).subscribe(_ => this.hiveSection.isDeleted = false);
  }

  onPurge(hiveSectionId: number) {
    this.hiveSectionService.deleteHiveSection(hiveSectionId).subscribe(()=>this.navigateToHiveSections());
  }
}
