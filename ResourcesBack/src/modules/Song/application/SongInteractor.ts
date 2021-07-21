import { SongDTO } from "@shared/application/DTOs/SongDTO";
import { SongMinDTO } from "@shared/application/DTOs/SongMinDTO";
import { InvalidArgumentError } from "@shared/domain/Errors/InvalidArgumentError";
import PaginationProps from "@shared/domain/PaginationProps";
import { SongId } from "@shared/domain/SongId";

import Song from "@song/domain/Song";
import SongRepository from "@song/domain/SongRepository";

export default class SongInteractor {

    readonly songRepository: SongRepository;

    constructor(songRepository: SongRepository) {
        //  Dependency injection
        this.songRepository= songRepository;
    }

    async getOneSong(id: string): Promise<SongDTO> {
        const song: Song = await this.songRepository.getOne(new SongId(id));
        return song.toPrimitives();
    }

    async getSomeSongs(ids: string[]): Promise<SongMinDTO[]> {
        if (ids.length === 0) return [];
        const songs: Song[] = await this.songRepository.getSome(ids);
        return songs.map(song => {
            return song.toMinPrimitives();
        });
    }

    async getAllSongs(page?: number, pageSize?: number): Promise<SongDTO[]> {
        let paginationProps: PaginationProps | undefined = undefined;
        if( page && pageSize ) {
            if (page < 0) throw new InvalidArgumentError('Invalid page!');
            if (pageSize < 0) throw new InvalidArgumentError('Invalid page size!');
            paginationProps = {page, pageSize};
        }
        const songs: Song[] = await this.songRepository.getAll(paginationProps);
        return songs.map(song => {
            return song.toPrimitives();
        });
    }

}