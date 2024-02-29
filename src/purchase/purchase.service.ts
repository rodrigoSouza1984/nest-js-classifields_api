import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PurchaseEntity } from './entities/purchase.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PurchaseEntity) private purchaseEntityRepository: Repository<PurchaseEntity>,   
  ) { }

  async create(createPurchaseDto: CreatePurchaseDto) {
    try{

      const queryValidations = this.userRepository.createQueryBuilder('user')

      const validations: any = await queryValidations.getOne()

      const buyerExists = validations

      if(!buyerExists){
        throw new HttpException(`Buyer not found`, HttpStatus.NOT_FOUND);
      }

      return 'This action adds a new purchase';
      
    }catch(err){
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
    
  }

  findAll() {
    return `This action returns all purchase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
