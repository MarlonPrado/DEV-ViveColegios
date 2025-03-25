import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { AcademicAreaCoursePeriodValuationRepository, AcademicAreaRepository, AcademicPeriodRepository, CampusRepository, PerformanceLevelRepository, StudentRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewAcademicAreaCoursePeriodValuation } from '../../inputs/CampusAdministrator/NewAcademicAreaCoursePeriodValuation';
import { IContext } from '../../interfaces/IContext';
import { AcademicAreaCoursePeriodValuation, AcademicAreaCoursePeriodValuationConnection } from '../../models/CampusAdministrator/AcademicAreaCoursePeriodValuation';
import { Campus } from '../../models/GeneralAdministrator/Campus';
import { Student } from '../../models/GeneralAdministrator/Student';
import { User } from '../../models/GeneralAdministrator/User';
import { AcademicArea } from '../../models/SchoolAdministrator/AcademicArea';
import { AcademicPeriod } from '../../models/SchoolAdministrator/AcademicPeriod';
import { PerformanceLevel } from '../../models/SchoolAdministrator/PerformanceLevel';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(AcademicAreaCoursePeriodValuation)
export class AcademicAreaCoursePeriodValuationResolver {
    @InjectRepository(AcademicAreaCoursePeriodValuation)
    private repository = AcademicAreaCoursePeriodValuationRepository;

    @InjectRepository(User)
    private repositoryUser = UserRepository;

    @InjectRepository(Campus)
    private repositoryCampus = CampusRepository;

    @InjectRepository(AcademicArea)
    private repositoryAcademicArea = AcademicAreaRepository;

    @InjectRepository(AcademicPeriod)
    private repositoryAcademicPeriod = AcademicPeriodRepository;

    @InjectRepository(Student)
    private repositoryStudent = StudentRepository;

    @InjectRepository(PerformanceLevel)
    private repositoryPerformanceLevel = PerformanceLevelRepository;

    @Query(() => AcademicAreaCoursePeriodValuation, { nullable: true })
    async getAcademicAreaCoursePeriodValuation(@Arg('id', () => String) id: string) {
        const result = await this.repository.findOneBy(id);
        return result;
    }

    @Query(() => AcademicAreaCoursePeriodValuationConnection)
    async getAllAcademicAreaCoursePeriodValuation(
        @Args() args: ConnectionArgs,
        @Arg('allData', () => Boolean) allData: Boolean,
        @Arg('orderCreated', () => Boolean) orderCreated: Boolean,
        @Arg('academicAreaId', () => String) academicAreaId: String,
        @Arg('academicPeriodId', () => String) academicPeriodId: String,
        @Arg('studentId', () => String, { nullable: true }) studentId: String,
    ): Promise<AcademicAreaCoursePeriodValuationConnection> {
        let result;
        if (allData) {
            if (orderCreated) {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId
                        },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                        },
                    });
                }
            }
        } else {
            if (orderCreated) {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            active: true,
                        },
                        order: { createdAt: 'DESC' },
                    });
                }
            } else {
                if (academicAreaId && academicPeriodId && studentId) {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            studentId,
                            active: true,
                        },
                    });
                } else {
                    result = await this.repository.findBy({
                        where: {
                            academicAreaId,
                            academicPeriodId,
                            active: true,
                        },
                    });
                }
            }
        }
        let resultConn = new AcademicAreaCoursePeriodValuationConnection();
        let resultConnection = connectionFromArraySlice(result, args, {
            sliceStart: 0,
            arrayLength: result.length,
        });
        resultConn = { ...resultConnection, totalCount: result.length };
        return resultConn;
    }

    @Mutation(() => AcademicAreaCoursePeriodValuation)
    async createAcademicAreaCoursePeriodValuation(
        @Arg('data') data: NewAcademicAreaCoursePeriodValuation,
        @Ctx() context: IContext
    ): Promise<AcademicAreaCoursePeriodValuation> {
        let dataProcess: NewAcademicAreaCoursePeriodValuation = removeEmptyStringElements(data);
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

    @Mutation(() => AcademicAreaCoursePeriodValuation)
    async updateAcademicAreaCoursePeriodValuation(
        @Arg('data') data: NewAcademicAreaCoursePeriodValuation,
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<AcademicAreaCoursePeriodValuation | null> {
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
    async changeActiveAcademicAreaCoursePeriodValuation(
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
    async deleteAcademicAreaCoursePeriodValuation(
        @Arg('id', () => String) id: string,
        @Ctx() context: IContext
    ): Promise<Boolean | null> {
        let data = await this.repository.findOneBy(id);
        let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
        return result?.result?.ok === 1 ?? true;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async createdByUser(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.createdByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => User, { nullable: true })
    async updatedByUser(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.updatedByUserId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryUser.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => Campus, { nullable: true })
    async campus(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.campusId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryCampus.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicArea, { nullable: true })
    async academicAsignatureCourse(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.academicAreaId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicArea.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => AcademicPeriod, { nullable: true })
    async academicPeriod(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.academicPeriodId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryAcademicPeriod.findOneBy(id);
            return result;
        }
        return null;
    }
    @FieldResolver((_type) => Student, { nullable: true })
    async student(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.studentId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryStudent.findOneBy(id);
            return result;
        }
        return null;
    }

    @FieldResolver((_type) => PerformanceLevel, { nullable: true })
    async performanceLevel(@Root() data: AcademicAreaCoursePeriodValuation) {
        let id = data.performanceLevelId;
        if (id !== null && id !== undefined) {
            const result = await this.repositoryPerformanceLevel.findOneBy(id);
            return result;
        }
        return null;
    }
}
