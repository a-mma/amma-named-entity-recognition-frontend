import { TestBed, inject } from '@angular/core/testing';

import { TrainingDataService } from './training-data.service';

describe('TrainingDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingDataService]
    });
  });

  it('should be created', inject([TrainingDataService], (service: TrainingDataService) => {
    expect(service).toBeTruthy();
  }));
});
