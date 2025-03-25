import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicAreaCourseYearValuationRepository, AcademicAreaRepository, CampusRepository, PerformanceLevelRepository, SchoolYearRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAreaCourseYearValuation } from '../../inputs/CampusAdministrator/NewAcademicAreaCourseYearValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAreaCourseYearValuation, AcademicAreaCourseYearValuationConnection } from '../../models/CampusAdministrator/AcademicAreaCourseYearValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { SchoolYear } from '../../models/SchoolAdministrator/SchoolYear';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicAreaCourseYearValuation)
export class AcademicAreaCourseYearValuationResolver {
  @InjectRepository(AcademicAreaCourseYearValuation)
  private repository = AcademicAreaCourseYearValuationRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @InjectRepository(Campus)
  private repositoryCampus = CampusRepository;

  @InjectRepository(AcademicArea)
  private repositoryAcademicArea = AcademicAreaRepository;

  @InjectRepository(SchoolYear)
  private repositorySchoolYear = SchoolYearRepository;

  @InjectRepository(Student)
  private repositoryStudent = StudentRepository;

  @InjectRepository(PerformanceLevel)
  private repositoryPerformanceLevel = PerformanceLevelRepository;

  @Query(() => AcademicAreaCourseYearValuation, { nullable: true })
  async getAcademicAreaCourseYearValuation(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => AcademicAreaCourseYearValuationConnection)
  async getAllAcademicAreaCourseYearValuation(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
    @Arg('academicAreaId', () => String) academicAreaId: String,
    @Arg('schoolYearId', () => String) schoolYearId: String,
    @Arg('studentId', () => String, { nullable: true }) studentId: String,
  ): Promise<AcademicAreaCourseYearValuationConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        if (academicAreaId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAreaId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
            },
          });
        }
      }
    } else {
      if (orderCreated) {
        if (academicAreaId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              active: true,
            },
            order: { createdAt: 'DESC' },
          });
        }
      } else {
        if (academicAreaId && schoolYearId && studentId) {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              studentId,
              active: true,
            },
          });
        } else {
          result = await this.repository.findBy({
            where: {
              academicAreaId,
              schoolYearId,
              active: true,
            },
          });
        }
      }
    }
    let resultConn = new AcademicAreaCourseYearValuationConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => AcademicAreaCourseYearValuation)
  async createAcademicAreaCourseYearValuation(
    @Arg('data') data: NewAcademicAreaCourseYearValuation,
    @Ctx() context: IContext
  ): Promise<AcademicAreaCourseYearValuation> {
    let dataProcess: NewAcademicAreaCourseYearValuation = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    return result;
  }

  @Mutation(() => AcademicAreaCourseYearValuation)
  async updateAcademicAreaCourseYearValuation(
    @Arg('data') data: NewAcademicAreaCourseYearValuation,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<AcademicAreaCourseYearValuation | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      ...dataProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveAcademicAreaCourseYearValuation(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    if (result.id) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteAcademicAreaCourseYearValuation(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Campus, { nullable: true })
  async campus(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.campusId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryCampus.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => AcademicArea, { nullable: true })
  async academicAsignatureCourse(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.academicAreaId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryAcademicArea.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => SchoolYear, { nullable: true })
  async schoolYear(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.schoolYearId;
    if (id !== null && id !== undefined) {
      const result = await this.repositorySchoolYear.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => Student, { nullable: true })
  async student(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.studentId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryStudent.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => PerformanceLevel, { nullable: true })
  async performanceLevel(@Root() data: AcademicAreaCourseYearValuation) {
    let id = data.performanceLevelId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryPerformanceLevel.findOneBy(id);
      return result;
    }
    return null;
  }
}
