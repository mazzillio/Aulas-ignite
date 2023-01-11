import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Rental } from "../../infra/models/Rental";
import { IRentalsRepository } from "../../repositories/IRentalsRepository";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}
export class CreateRentalService {
  constructor(
    private rentalsRepository: IRentalsRepository,
    private dateProvider: IDateProvider
  ) {}
  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minDiffHour = 24;
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );
    if (carUnavailable) {
      throw new AppError("Car is unavailable");
    }
    const rentalOpenToUSer = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );
    if (rentalOpenToUSer) {
      throw new AppError("There´s rental in progress for user!");
    }
    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(
      dateNow,
      expected_return_date
    );
    if (compare < minDiffHour) {
      throw new AppError("Invalid return time");
    }
    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });
    return rental;
  }
}
