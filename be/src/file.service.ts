import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as csv from 'async-csv';

interface Record {
    [key: string]: string | number | undefined;
}

@Injectable()
export class FileService {
    private readonly dataPath = 'data';

    async readRecords(dataName: string): Promise<any> {
        const path = this.createCSVPath(dataName);

        try {
            const file = await this.getFile(path);
            return csv.parse(file);
        } catch (err) {
            throw err;
        }
    }

    async updateRecord<T>(dataName: string, id: number, record: T, lastIdx?: number): Promise<T> {
        const path = this.createCSVPath(dataName);

        try {
            const arr = await this.getFileAsArray(path);
            const idx = arr.findIndex(el => this.getIdFromStr(el) === id);

            if (~idx) {
                let lastValues = '';

                if (~lastIdx) {
                    const a = arr[idx].split(',');
                    lastValues = a.splice(lastIdx, a.length - lastIdx).join();
                }

                arr[idx] = `${id},${Object.values(record).join()},${lastValues}`;
                await fs.writeFile(path, arr.join('\n'));
            }

            return record;
        } catch (err) {
            throw err;
        }
    }

    async removeRecord(dataName: string, id: number): Promise<boolean> {
        const path = this.createCSVPath(dataName);

        try {
            const arr = await this.getFileAsArray(path);
            const newFileArr = arr.filter(el => this.getIdFromStr(el) !== id);

            const result = newFileArr.length !== arr.length;

            result && await fs.writeFile(path, newFileArr.join('\n'));

            return result;
        } catch (err) {
            throw err;
        }
    }

    async writeRecords(dataName: string, records: any[]): Promise<number> {
        const path = this.createCSVPath(dataName);

        const file = await this.getFile(path);
        const lastId = this.getLastLineId(file);

        try {
            await fs.appendFile(path, this.stringifyRecords(records, lastId), { encoding: 'utf-8' });
            return lastId;
        } catch (err) {
            throw err;
        }
    }
 
    private async getFile(path: string): Promise<string> {
        return await fs.readFile(path, { encoding: 'utf-8' });
    }

    private async getFileAsArray(path: string): Promise<string[]> {
        const file = await this.getFile(path);
        return file.split('\n');
    }

    private stringifyRecords(records: Record[], lastId: number): string {
        let str: string = '';
        for (let i = 0; i < records.length; i++) {
            str += `${lastId + i + 1},${Object.values(records[i]).join()}\n`;
        }

        return str;
    }

    private getLastLineId(str: string): number {
        const arr = str.split(/\r?\n/);
        const last = arr[arr.length - 2];
        const id = this.getIdFromStr(last);
        return id || 0;
    }

    private getIdFromStr(str: string): number {
        const id: string = str.substring(0, str.indexOf(','));
        return id && +id;
    }

    private createCSVPath(dataName: string): string {
        const { dataPath } = this;
        return `${dataPath}/${dataName}-${dataPath}.csv`;
    }
}
