import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TrainingData } from '../shared/models/training-data.model';
@Injectable()
export class TrainingDataService {
  API_ENDPOINT = environment.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { console.log(environment.API_ENDPOINT); }

  submitTrainingData(trainingData: TrainingData) {
    return this.httpClient.post(this.API_ENDPOINT, trainingData);
  }

  public extractData(res: Response) {
    const body = res.json();
    console.log(body);
    return body || {};
  }

}
